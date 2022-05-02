<?php
  $userid = "webuser";
  $passwd = "";
 
  try {
      $dbh = new PDO(
          'mysql:host=localhost; dbname=extrusion; charset=utf8',
          $userid,
          $passwd,
          array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
      )
      );

      $sql = "
        SELECT 
            production_number_id,
            production_number,
            GROUP_CONCAT(lim) AS lim,
            GROUP_CONCAT(lex) AS lex,
            SUM(ttim) AS ttim,
            SUM(ttex) AS ttex,
            SUM(Total) AS total
        FROM
            (SELECT 
                m_production_numbers.id AS production_number_id,
                m_production_numbers.production_number,
                DATE_FORMAT(MAX(t_import.import_at), '%y-%m-%d') AS lim,
                NULL AS lex,
                SUM(quantity) AS ttim,
                0 AS ttex,
                SUM(quantity) AS Total
            FROM
                extrusion.t_import
            LEFT JOIN m_ordersheet ON m_ordersheet.id = t_import.ordersheet_id
            LEFT JOIN m_production_numbers ON m_production_numbers.id = m_ordersheet.production_numbers_id
            GROUP BY production_number UNION ALL SELECT 
                t_export.production_number_id,
                m_production_numbers.production_number,
                NULL AS lim,
                DATE_FORMAT(MAX(t_export.export_at), '%y-%m-%d') AS lex,
                0 AS ttim,
                SUM(t_export.quantity) AS ttex,
                SUM(t_export.quantity) * - 1 AS Total
            FROM
                extrusion.t_export
            LEFT JOIN m_production_numbers ON m_production_numbers.id = t_export.production_number_id
            GROUP BY t_export.production_number_id) x
        GROUP BY production_number_id
        ORDER BY lim DESC , lex DESC;
        ";

      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
