<?php
  /* 21/08/25作成 */
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
          t_packing_box_number.id,
          t_packing_box_number.box_number,
          IFNULL(
            (
              SELECT
                SUM(t_packing_box.work_quantity)
              FROM
                t_packing_box
              WHERE
                t_packing_box.box_number_id = t_packing_box_number.id
            ),
            0
          ) AS work_qty
        FROM
          t_packing_box_number
        WHERE
          t_packing_box_number.m_ordersheet_id = :m_ordersheet_id
        ORDER BY box_number
      ";

      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':m_ordersheet_id', (INT)$_POST["m_ordersheet_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
