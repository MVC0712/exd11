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
          t20.m_ordersheet_id,
          t20.ordersheet_number,
          t20.production_number,
          DATE_FORMAT(t20.delivery_date_at, '%m-%d') AS devivery_date_at,
          FORMAT(t20.production_quantity, 0),
          FORMAT(t20.packed_work_quantitiy, 0),
          IFNULL(t30.packed_box_quantity, 0) as packed_box_quantity
        FROM
          (
            SELECT
              m_ordersheet.id AS m_ordersheet_id,
              m_ordersheet.ordersheet_number,
              m_ordersheet.delivery_date_at,
              m_ordersheet.production_quantity,
              IFNULL(SUM(t_packing_box.work_quantity), 0) AS packed_work_quantitiy,
              m_production_numbers.production_number
            FROM
              m_ordersheet
              LEFT JOIN t_packing_box_number ON t_packing_box_number.m_ordersheet_id = m_ordersheet.id
              LEFT JOIN t_packing_box ON t_packing_box.box_number_id = t_packing_box_number.id
              left join m_production_numbers on m_ordersheet.production_numbers_id = m_production_numbers.id
            GROUP BY
              m_ordersheet.id
          ) AS t20
          LEFT JOIN (
            SELECT
              t10.m_ordersheet_id,
              COUNT(*)  AS packed_box_quantity
            FROM
              (
                SELECT
                  t_packing_box_number.m_ordersheet_id
                FROM
                  t_packing_box_number
                WHERE
                  t_packing_box_number.id IN (
                    SELECT
                      DISTINCT t_packing_box.box_number_id
                    FROM
                      t_packing_box
                  )
              ) AS t10
            GROUP BY
              t10.m_ordersheet_id
          ) AS t30 ON t20.m_ordersheet_id = t30.m_ordersheet_id
          ORDER BY t20.delivery_date_at DESC, t20.production_number
      ";

      $prepare = $dbh->prepare($sql);
      // $prepare->bindValue(':t_press_id', (INT)$_POST["t_press_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
