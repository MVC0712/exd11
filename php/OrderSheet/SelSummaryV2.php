<?php
  /* 21/05/17作成 */
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

      $prepare = $dbh->prepare("

      SELECT 
        m_ordersheet.id,
        m_ordersheet.ordersheet_number,
        m_ordersheet.delivery_date_at,
        m_ordersheet.issue_date_at,
        m_production_numbers.production_number,
        m_ordersheet.production_quantity,
        SUM(t10.work_quantity) AS work_quantity,
        SUM(t10.total_ng) AS total_ng,
        SUM(t10.work_quantity) - SUM(t10.total_ng) AS total_ok,
        m_ordersheet.updated_at
      FROM m_ordersheet
      LEFT JOIN t_press ON t_press.ordersheet_id = m_ordersheet.id
      LEFT JOIN m_production_numbers ON m_ordersheet.production_numbers_id = m_production_numbers.id
      LEFT JOIN 
        (
          SELECT
            t_using_aging_rack.t_press_id,
            SUM(IFNULL(t_using_aging_rack.work_quantity, 0)) AS work_quantity,
            SUM(IFNULL((
              SELECT
                SUM(t_press_quality.ng_quantities)
              FROM
                t_press_quality
              WHERE
                t_press_quality.using_aging_rack_id = t_using_aging_rack.id
              GROUP BY
                t_press_quality.using_aging_rack_id
            ), 0))  AS total_ng
          FROM
            t_using_aging_rack
          GROUP BY t_using_aging_rack.t_press_id
        ) t10 ON t10.t_press_id = t_press.id
      GROUP BY m_ordersheet.id
      ORDER BY issue_date_at DESC


    ");
      $prepare->execute();
      $result = $prepare->fetchALL(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
