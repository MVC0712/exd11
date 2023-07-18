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
    DATE_FORMAT(m_ordersheet.delivery_date_at, '%m-%d') as delivery_date_at,
    DATE_FORMAT(m_ordersheet.issue_date_at, '%m-%d') as issue_date_at,
    m_production_numbers.production_number,
    IFNULL(FORMAT(m_ordersheet.production_quantity, 0), 0) AS production_quantity,    
    IFNULL(FORMAT(SUM(t10.work_quantity), 0), 0) AS work_quantity,
    IFNULL(FORMAT(SUM(t10.total_ng), 0), 0) AS total_ng,
    IFNULL(FORMAT((SUM(t10.work_quantity) - SUM(t10.total_ng)),
                0),
            0) AS total_ok,
    IFNULL(FORMAT((IFNULL(SUM(t10.work_quantity), 0) - IFNULL(SUM(t10.total_ng), 0) - m_ordersheet.production_quantity),
                0),
            0) AS diff_qty,
    FORMAT(t20.packed_work_quantitiy, 0) AS packed,
    IFNULL((m_ordersheet.production_quantity - t20.packed_work_quantitiy),
            0) AS NP,
    m_ordersheet.note,
    DATE_FORMAT(m_ordersheet.updated_at, '%m-%d') as updated_at
FROM
    m_ordersheet
        LEFT JOIN
    t_press ON t_press.ordersheet_id = m_ordersheet.id
        LEFT JOIN
    m_production_numbers ON m_ordersheet.production_numbers_id = m_production_numbers.id
        LEFT JOIN
    (SELECT 
        t_using_aging_rack.t_press_id,
            SUM(IFNULL(t_using_aging_rack.work_quantity, 0)) AS work_quantity,
            SUM(IFNULL((SELECT 
                    SUM(t_press_quality.ng_quantities)
                FROM
                    t_press_quality
                WHERE
                    t_press_quality.using_aging_rack_id = t_using_aging_rack.id
                GROUP BY t_press_quality.using_aging_rack_id), 0)) AS total_ng
    FROM
        t_using_aging_rack
    GROUP BY t_using_aging_rack.t_press_id) t10 ON t10.t_press_id = t_press.id
        LEFT JOIN
    (SELECT 
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
    LEFT JOIN m_production_numbers ON m_ordersheet.production_numbers_id = m_production_numbers.id
    GROUP BY m_ordersheet.id) t20 ON t20.m_ordersheet_id = m_ordersheet.id
GROUP BY m_ordersheet.id
ORDER BY issue_date_at DESC , delivery_date_at DESC , ordersheet_number DESC;

    ");
      $prepare->execute();
      $result = $prepare->fetchALL(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
