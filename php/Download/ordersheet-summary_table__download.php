<?php
// 21/09/04
    $dbname = "vn_pd2";
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

      $file_path = "../../download/" . $_POST["file_name"] . ".csv";
      // print_r($file_path);
      $export_csv_title = [
        "ID", "OrderSheet", "DeliveryDate", "IssueDate", "ProductionNumber", "Order Quantity", 
        "WorkQuantity", "TotalNG", "TotalOK", "Packed", "ImportQuantity", "Note", "UpdatedAt"
      ];
      $export_csv_title_sub = [
        "press_date_at", "pressing_time", "die_number", "production_number", "specific_weight", 
        "production_length", "production_weight", "discard_thickness", "discard_weight",
        "pressing_type", "plan_billet_quantities", "actual_billet_quantities",
        "billet_length", "billet_size",
        "work_quantity", "total_ng", "total_ok", "dimension_check_date", "etching_check_date",
        "aging_check_date", "packing_check_date", "code_301", "code_302", "code_303", "code_304",
        "code_305", "code_306", "code_307", "code_308", "code_309", "code_310", "code_311", "code_312",
        "code_313", "code_314", "code_315", "code_316", "code_317", "code_318", "code_319", "code_320",
        "code_321", "code_322", "code_323", "code_324", "code_351"];
      $export_sql = "
      SELECT 
    m_ordersheet.id,
    m_ordersheet.ordersheet_number,
    DATE_FORMAT(m_ordersheet.delivery_date_at,
            '%y-%m-%d') AS delivery_date_at,
    DATE_FORMAT(m_ordersheet.issue_date_at, '%y-%m-%d') AS issue_date_at,
    m_production_numbers.production_number,
    IFNULL(FORMAT(m_ordersheet.production_quantity,
                0),
            0) AS production_quantity,
    IFNULL(FORMAT(SUM(t10.work_quantity), 0), 0) AS work_quantity,
    IFNULL(FORMAT(SUM(t10.total_ng), 0), 0) AS total_ng,
    IFNULL(FORMAT((SUM(t10.work_quantity) - SUM(t10.total_ng)),
                0),
            0) AS total_ok,
    FORMAT(t20.packed_work_quantitiy, 0) AS packed,
    t1010.import_q,
    m_ordersheet.note,
    DATE_FORMAT(m_ordersheet.updated_at, '%y-%m-%d') AS updated_at
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
        LEFT JOIN
    (SELECT 
        m_ordersheet.id AS order_id, SUM(quantity) AS import_q
    FROM
        extrusion.t_import
    LEFT JOIN m_ordersheet ON m_ordersheet.id = t_import.ordersheet_id
    LEFT JOIN m_production_numbers ON m_production_numbers.id = m_ordersheet.production_numbers_id
    GROUP BY ordersheet_id) t1010 ON t1010.order_id = m_ordersheet.id
GROUP BY m_ordersheet.id
ORDER BY issue_date_at DESC , delivery_date_at DESC , ordersheet_number DESC;";

      // Header out put
      foreach ($export_csv_title as $key => $val) {
          $export_header[] = mb_convert_encoding($val, 'SJIS-win', 'UTF-8');
      }
      foreach ($export_csv_title_sub as $key => $val) {
          $export_header_sub[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8'); //
      }
      /*
          Make CSV Part
       */
      if (touch($file_path)) {
          $file = new SplFileObject($file_path, "w");
          // write csv header
          $file->fputcsv($export_header);
          // $file->fputcsv($export_header_sub);
          // query database
          $stmt = $dbh->query($export_sql);
          // create csv sentences
          while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
              $file->fputcsv(mb_convert_encoding($row, 'UTF-8', 'UTF-8')); // SJISに変換する
          }
      }
      echo json_encode("Made a CSV file aa");
  } catch (PDOException $e) {
      print('Connection failed:'.$e->getMessage());
      die();
  }

    // close database connection
  $dbh = null;
