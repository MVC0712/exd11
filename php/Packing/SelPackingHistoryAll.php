<?php
  /* 21/08/31作成 */
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
          t_packing.id AS t_packing_id,
                  DATE_FORMAT(t_packing.packing_date, '%m-%d') AS packing_date,
                  TIME_FORMAT(t_packing.packing_start, '%H:%i') AS packing_start,
                  TIME_FORMAT(t_packing.packing_end, '%H:%i') AS packing_end,
          #	t_packing_box.id AS t_packing_box_id,
          t20.production_number,
          (
            SELECT
              COUNT(*)
            FROM
              t_packing_worker
            WHERE
              t_packing_worker.t_packing_id = t_packing.id
          ) AS number_of_worker,
          (
            SELECT
              COUNT(DISTINCT t_packing_box.box_number_id)
            FROM
              t_packing_box
            WHERE
              t_packing_box.packing_id = t_packing.id
          ) AS number_of_making_box
        FROM
          t_packing
          LEFT JOIN t_packing_box ON t_packing_box.packing_id = t_packing.id
          LEFT JOIN (
            SELECT
              t_packing_box.id AS t_packing_box_id,
              t10.production_number
            FROM
              t_packing_box
              LEFT JOIN (
                SELECT
                  t_using_aging_rack.id AS t_using_aging_rack_id,
                  m_production_numbers.production_number
                FROM
                  t_using_aging_rack
                  LEFT JOIN t_press ON t_using_aging_rack.t_press_id = t_press.id
                  LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
                  LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
              ) AS t10 ON t_packing_box.using_aging_rack_id = t10.t_using_aging_rack_id
          ) AS t20 ON t_packing_box.id = t20.t_packing_box_id
        WHERE
          t_packing.packing_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
        GROUP BY
          t_packing.id
        ORDER BY t_packing.packing_date DESC
       ";
      $prepare = $dbh->prepare($sql);

      // $prepare->bindValue(':m_ordersheet_id', (INT)$_POST["m_ordersheet_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
