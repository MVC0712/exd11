<?php
  /* 21/06/22作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  
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
            t_export.id,
            t_export.production_number_id,
            m_production_numbers.production_number,
            DATE_FORMAT(t_export.export_at, '%y-%m-%d %H:%i') AS export_at,
            t_export.quantity
        FROM
            extrusion.t_export
        LEFT JOIN
            m_production_numbers ON m_production_numbers.id = t_export.production_number_id
        ORDER BY export_at DESC;
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
