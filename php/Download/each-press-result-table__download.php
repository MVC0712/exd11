<?php
// 21/06/18
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

      // $file_path = "../../download/date-diename-billetqty.csv";
      $file_path = "../../download/" . $_POST["file_name"] . ".csv";

      $export_csv_title = [
          "date", "die_number", "production_number", "specific_weight", "discard_thickness",
          "stretch_reatio", "press_start", "press_finish", "press_type", "billet_size",
          "billet_length", "billet_lot_no", "plan_billet_input", "actual_billet_input",
          "actual_ram_speed", "actual_die_temp", "ok_works", "1st_billet_work_length",
          "2nd_billet_work_length", "work_qty_from_1st_billet", "work_qty_from_2nd_billet",
          "total_ng_works", "301", "302", "303", "304", "305", "306", "307", "308", "309",
          "310", "311", "312", "313", "314", "315", "316", "317", "318", "319", "320",
          "321", "322", "323", "324", "351",
          "billet_No01_work_length", "billet_No02_work_length", "billet_No03_work_length",
          "billet_No04_work_length", "billet_No05_work_length", "billet_No06_work_length",
          "billet_No07_work_length", "billet_No08_work_length", "billet_No09_work_length",
          "billet_No10_work_length", "billet_No11_work_length", "billet_No12_work_length",
          "billet_No13_work_length", "billet_No14_work_length", "billet_No15_work_length",
          "billet_No16_work_length", "billet_No17_work_length", "billet_No18_work_length",
          "billet_No19_work_length", "billet_No20_work_length"
           ];
      $export_csv_title_sub = [
        "押出日", "型番", "品番",  "単重", "ディスカード厚", "ストレッチ", "開始", "終了", "押出種別", "ビレットサイズ",
        "ビレット長さ", "ビレット製造番号", "計画ビレット数", "実績ビレット数", "ラム速（実測）", "金型温度（実測）",
        "良品数", "1stビレット押出長さ", "2ndビレット押出長さ", "1stビレット製品数", "2ndビレット製品数", "総不良数",
        "301", "302", "303", "304", "305", "306", "307", "308", "309", "310", "311", "312", "313", "314", "315", "316",
        "317", "318", "319", "320", "321", "322", "323", "324", "351",
        "ビレット01本目製品長", "ビレット02本目製品長", "ビレット03本目製品長さ",
        "ビレット04本目製品長", "ビレット05本目製品長", "ビレット06本目製品長さ",
        "ビレット07本目製品長", "ビレット08本目製品長", "ビレット09本目製品長さ",
        "ビレット10本目製品長", "ビレット11本目製品長", "ビレット12本目製品長さ",
        "ビレット13本目製品長", "ビレット14本目製品長", "ビレット15本目製品長さ",
        "ビレット16本目製品長", "ビレット17本目製品長", "ビレット18本目製品長さ",
        "ビレット19本目製品長", "ビレット20本目製品長"
      ];
      $export_sql = "

      SELECT 
      t_press.press_date_at,
      m_dies.die_number,
      m_production_numbers.production_number,
      m_production_numbers.specific_weight,
      t_press_directive.discard_thickness,
      t_press_directive.stretch_ratio,
      t_press.press_start_at,
      t_press.press_finish_at,
      m_pressing_type.pressing_type,
      t_press.billet_size,
      t_press.billet_length,
      t_press.billet_lot_number,
      t_press.plan_billet_quantities,
      t_press.actual_billet_quantities,
      t_press.actual_ram_speed,
      t_press.actual_die_temperature,
      t_press.counted_ok_works,
      1st_billet_work_length,
      2nd_billet_work_length,
      1st_billet_work_quantity,
      2nd_billet_work_quantity,
      IFNULL(t2.NG_TOTAL, 0) AS ng_total,
      IFNULL(t2.301, 0) AS ng_301,
      IFNULL(t2.302, 0) AS ng_302,
      IFNULL(t2.303, 0) AS ng_303,
      IFNULL(t2.304, 0) AS ng_304,
      IFNULL(t2.305, 0) AS ng_305,
      IFNULL(t2.306, 0) AS ng_306,
      IFNULL(t2.307, 0) AS ng_307,
      IFNULL(t2.308, 0) AS ng_308,
      IFNULL(t2.309, 0) AS ng_309,
      IFNULL(t2.310, 0) AS ng_310,
      IFNULL(t2.311, 0) AS ng_311,
      IFNULL(t2.312, 0) AS ng_312,
      IFNULL(t2.313, 0) AS ng_313,
      IFNULL(t2.314, 0) AS ng_314,
      IFNULL(t2.315, 0) AS ng_315,
      IFNULL(t2.316, 0) AS ng_316,
      IFNULL(t2.317, 0) AS ng_317,
      IFNULL(t2.318, 0) AS ng_318,
      IFNULL(t2.319, 0) AS ng_319,
      IFNULL(t2.320, 0) AS ng_320,
      IFNULL(t2.321, 0) AS ng_321,
      IFNULL(t2.322, 0) AS ng_322,
      IFNULL(t2.323, 0) AS ng_323,
      IFNULL(t2.324, 0) AS ng_324,
      IFNULL(t2.351, 0) AS ng_351,
      t3.billet_No01_work_length AS billet_No01_work_length,
      t3.billet_No02_work_length AS billet_No02_work_length,
      t3.billet_No03_work_length AS billet_No03_work_length,
      t3.billet_No04_work_length AS billet_No04_work_length,
      t3.billet_No05_work_length AS billet_No05_work_length,
      t3.billet_No06_work_length AS billet_No06_work_length,
      t3.billet_No07_work_length AS billet_No07_work_length,
      t3.billet_No08_work_length AS billet_No08_work_length,
      t3.billet_No09_work_length AS billet_No09_work_length,
      t3.billet_No10_work_length AS billet_No10_work_length,
      t3.billet_No11_work_length AS billet_No11_work_length,
      t3.billet_No12_work_length AS billet_No12_work_length,
      t3.billet_No13_work_length AS billet_No13_work_length,
      t3.billet_No14_work_length AS billet_No14_work_length,
      t3.billet_No15_work_length AS billet_No15_work_length,
      t3.billet_No16_work_length AS billet_No16_work_length,
      t3.billet_No17_work_length AS billet_No17_work_length,
      t3.billet_No18_work_length AS billet_No18_work_length,
      t3.billet_No19_work_length AS billet_No19_work_length,
      t3.billet_No20_work_length AS billet_No20_work_length
  FROM
      t_press
          LEFT JOIN
      m_dies ON t_press.dies_id = m_dies.id
          LEFT JOIN
      m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
          LEFT JOIN
      m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
          LEFT JOIN
      t_press_directive ON t_press.press_directive_id = t_press_directive.id
          LEFT JOIN
      (SELECT 
          t_press_work_length_quantity.press_id,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 1 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS 1st_billet_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 2 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS 2nd_billet_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 1 THEN t_press_work_length_quantity.work_quantity
                  ELSE 0
              END) AS 1st_billet_work_quantity,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 2 THEN t_press_work_length_quantity.work_quantity
                  ELSE 0
              END) AS 2nd_billet_work_quantity
      FROM
          t_press_work_length_quantity
      GROUP BY t_press_work_length_quantity.press_id) t1 ON t1.press_id = t_press.id
          LEFT JOIN
      (SELECT 
          t_using_aging_rack.t_press_id AS press_id,
              SUM(t_press_quality.ng_quantities) AS NG_TOTAL,
              SUM(CASE
                  WHEN m_quality_code.quality_code = 301 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '301',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 302 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '302',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 303 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '303',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 304 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '304',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 305 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '305',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 306 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '306',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 307 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '307',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 308 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '308',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 309 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '309',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 310 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '310',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 311 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '311',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 312 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '312',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 313 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '313',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 314 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '314',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 315 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '315',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 316 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '316',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 317 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '317',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 318 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '318',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 319 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '319',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 320 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '320',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 321 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '321',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 322 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '322',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 323 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '323',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 324 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '324',
              SUM(CASE
                  WHEN m_quality_code.quality_code = 351 THEN t_press_quality.ng_quantities
                  ELSE 0
              END) AS '351'
      FROM
          t_using_aging_rack
      LEFT JOIN t_press_quality ON t_press_quality.using_aging_rack_id = t_using_aging_rack.id
      LEFT JOIN m_quality_code ON t_press_quality.quality_code_id = m_quality_code.id
      GROUP BY t_using_aging_rack.t_press_id) t2 ON t2.press_id = t_press.id
          LEFT JOIN
      (SELECT 
          t_press_work_length_quantity.press_id AS press_id,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 1 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No01_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 2 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No02_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 3 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No03_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 4 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No04_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 5 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No05_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 6 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No06_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 7 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No07_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 8 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No08_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 9 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No09_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 10 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No10_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 11 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No11_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 12 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No12_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 13 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No13_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 14 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No14_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 15 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No15_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 16 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No16_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 17 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No17_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 18 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No18_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 19 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No19_work_length,
              SUM(CASE t_press_work_length_quantity.billet_number
                  WHEN 20 THEN t_press_work_length_quantity.work_length
                  ELSE 0
              END) AS billet_No20_work_length
      FROM
          t_press_work_length_quantity
      GROUP BY t_press_work_length_quantity.press_id) t3 ON t3.press_id = t_press.id 
      
        ";

      // encoding title into SJIS-win
      foreach ($export_csv_title as $key => $val) {
          $export_header[] = mb_convert_encoding($val, 'SJIS-win', 'UTF-8');
      }
      foreach ($export_csv_title_sub as $key => $val) {
          $export_header_sub[] = mb_convert_encoding($val, 'SJIS-win', 'UTF-8'); // SJISに変換する
      }
      /*
          Make CSV Part
       */
      if (touch($file_path)) {
          $file = new SplFileObject($file_path, "w");
          // write csv header
          $file->fputcsv($export_header);
          $file->fputcsv($export_header_sub);
          // query database
          $stmt = $dbh->query($export_sql);
          // create csv sentences
          while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
              $file->fputcsv(mb_convert_encoding($row, 'SJIS-win', 'UTF-8')); // SJISに変換する
          }
      }
      echo json_encode("Made a CSV file aa");
  } catch (PDOException $e) {
      print('Connection failed:'.$e->getMessage());
      die();
  }

    // close database connection
  $dbh = null;
