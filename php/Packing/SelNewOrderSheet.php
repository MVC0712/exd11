<?php
  /* 21/09/09 */
  $userid = "webuser";
  $passwd = "";
//   print_r($_POST);
  
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
          (
            SELECT
              COUNT(*) + 1
            FROM
              m_ordersheet
            WHERE
              t1.production_numbers_id = production_numbers_id
              AND t1.delivery_date_at < delivery_date_at
          ) AS rank
        FROM
          m_ordersheet AS t1
        WHERE t1.id = :m_ordersheet_id
       ";
      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':m_ordersheet_id', (INT)$_POST["m_ordersheet_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetch(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
