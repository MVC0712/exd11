<?php
  /* 21/06/22作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  $search = $_POST['search'];
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

      $sql = "SELECT 
            t_import.id,
            m_ordersheet.id AS order_id,
            m_ordersheet.ordersheet_number,
            m_production_numbers.production_number,
            DATE_FORMAT(t_import.import_at, '%y-%m-%d') AS import_at,
            t_import.quantity
        FROM
            extrusion.t_import
        LEFT JOIN
            m_ordersheet ON m_ordersheet.id = t_import.ordersheet_id
        LEFT JOIN
            m_production_numbers ON m_production_numbers.id = m_ordersheet.production_numbers_id
            WHERE m_ordersheet.ordersheet_number LIKE '$search'
            OR m_production_numbers.production_number LIKE '$search'
        ORDER BY import_at DESC;
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
