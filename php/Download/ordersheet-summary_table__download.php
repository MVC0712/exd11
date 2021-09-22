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
        "オーダーシートID", "オーダーシート番号", "納期", "発行日", "品番", "数量", 
        "切断数量", "NG数", "OK数", "オーダーシート更新日"
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
		
        ";

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
