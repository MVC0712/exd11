<?php
  /* 21/09/12 */
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
            m_ordersheet.id,
            m_ordersheet.ordersheet_number,
            DATE_FORMAT(m_ordersheet.delivery_date_at, '%y-%m-%d') AS delivery_date_at,
            m_ordersheet.production_quantity,
            m_production_numbers.packing_quantity
        FROM
          m_ordersheet
        LEFT JOIN m_production_numbers ON m_ordersheet.production_numbers_id = m_production_numbers.id
        WHERE
          m_ordersheet.production_numbers_id IN (
            SELECT
              m_ordersheet.production_numbers_id
            FROM
              m_ordersheet
            WHERE
              m_ordersheet.id = :m_ordersheet_id
          )
          AND m_ordersheet.id != :m_ordersheet_id2
        order by m_ordersheet.delivery_date_at DESC
      ";

      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':m_ordersheet_id', $_POST["m_ordersheet_id"], PDO::PARAM_STR);
      $prepare->bindValue(':m_ordersheet_id2', $_POST["m_ordersheet_id"], PDO::PARAM_STR);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
