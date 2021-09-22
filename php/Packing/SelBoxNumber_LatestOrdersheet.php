<?php
  /* 21/09/08 */
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
          id,
          box_number
        FROM
          t_packing_box_number
        WHERE
          m_ordersheet_id = (
            SELECT
              t2.m_ordersheet_id
            FROM
              (
                SELECT
                  id AS m_ordersheet_id,
                  production_numbers_id,
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
              ) AS t2
            WHERE
              t2.production_numbers_id = :production_numbers_id
              AND 
              t2.rank = 1
          )
      ";

      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':production_numbers_id', (INT)$_POST["production_numbers_id"], PDO::PARAM_INT);
      // $prepare->bindValue(':limit', (INT)$_POST["limit"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
