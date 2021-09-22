<?php
// 21/06/02 修正
    $dbname = "vn_pd2";
    $userid = "webuser";
    $passwd = "";

  try{
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
    $export_csv_title = [
      "","","","","","","",
      "2021年1月","","","2021年2月","","","2021年3月","","","2021年4月","","","2021年5月","","","2021年6月","","",
      "2021年7月","","","2021年8月","","","2021年9月","","","2021年10月","","","2021年11月","","","2021年12月","",""
    ]; 
    $export_csv_title_sub = [
      "機種", "シリーズ", "品番", "型番", "材質", "熱処理", "単重",
      "試押","量試","量産","試押","量試","量産","試押","量試","量産","試押","量試","量産",
      "試押","量試","量産","試押","量試","量産","試押","量試","量産","試押","量試","量産",
      "試押","量試","量産","試押","量試","量産","試押","量試","量産","試押","量試","量産"
    ]; 
    $export_sql = "

SELECT
  production_data.category1,
  production_data.category2,
  production_data.production_number,
  m_dies.die_number,
  production_data.billet_material,
  production_data.aging_type,
  production_data.specific_weight,
  IFNULL(press_value.2101_1, 0) AS '2101_1',
  IFNULL(press_value.2101_2, 0) AS '2101_2',
  IFNULL(press_value.2101_3, 0) AS '2101_3',
  IFNULL(press_value.2102_1, 0) AS '2102_1',
  IFNULL(press_value.2102_2, 0) AS '2102_2',
  IFNULL(press_value.2102_3, 0) AS '2102_3',
  IFNULL(press_value.2103_1, 0) AS '2103_1',
  IFNULL(press_value.2103_2, 0) AS '2103_2',
  IFNULL(press_value.2103_3, 0) AS '2103_3',
  IFNULL(press_value.2104_1, 0) AS '2104_1',
  IFNULL(press_value.2104_2, 0) AS '2104_2',
  IFNULL(press_value.2104_3, 0) AS '2104_3',
  IFNULL(press_value.2105_1, 0) AS '2105_1',
  IFNULL(press_value.2105_2, 0) AS '2105_2',
  IFNULL(press_value.2105_3, 0) AS '2105_3',
  IFNULL(press_value.2106_1, 0) AS '2106_1',
  IFNULL(press_value.2106_2, 0) AS '2106_2',
  IFNULL(press_value.2106_3, 0) AS '2106_3',
  IFNULL(press_value.2107_1, 0) AS '2107_1',
  IFNULL(press_value.2107_2, 0) AS '2107_2',
  IFNULL(press_value.2107_3, 0) AS '2107_3',
  IFNULL(press_value.2108_1, 0) AS '2108_1',
  IFNULL(press_value.2108_2, 0) AS '2108_2',
  IFNULL(press_value.2108_3, 0) AS '2108_3',
  IFNULL(press_value.2109_1, 0) AS '2109_1',
  IFNULL(press_value.2109_2, 0) AS '2109_2',
  IFNULL(press_value.2109_3, 0) AS '2109_3',
  IFNULL(press_value.2110_1, 0) AS '2110_1',
  IFNULL(press_value.2110_2, 0) AS '2110_2',
  IFNULL(press_value.2110_3, 0) AS '2110_3',
  IFNULL(press_value.2111_1, 0) AS '2111_1',
  IFNULL(press_value.2111_2, 0) AS '2111_2',
  IFNULL(press_value.2111_3, 0) AS '2111_3',
  IFNULL(press_value.2112_1, 0) AS '2112_1',
  IFNULL(press_value.2112_2, 0) AS '2112_2',
  IFNULL(press_value.2112_3, 0) AS '2112_3'
FROM m_dies
LEFT JOIN 
(
  SELECT 
    m_production_numbers.id,
    m_production_numbers_category1.name_jp AS category1,
    m_production_numbers_category2.name_jp AS category2,
    m_production_numbers.production_number,
    m_billet_material.billet_material,
    m_aging_type.aging_type,
    m_production_numbers.specific_weight,
    'dummy'
  FROM  m_production_numbers
  LEFT JOIN m_production_numbers_category2 ON m_production_numbers.production_category2_id = m_production_numbers_category2.id
  LEFT JOIN m_production_numbers_category1 ON m_production_numbers_category2.category1_id = m_production_numbers_category1.id
  LEFT JOIN m_billet_material ON m_production_numbers.billet_material_id = m_billet_material.id
  LEFT JOIN m_aging_type ON m_production_numbers.aging_type_id = m_aging_type.id
) AS production_data
ON m_dies.production_number_id = production_data.id
LEFT JOIN 
(
  SELECT 
    t1.dies_id,
    SUM(CASE WHEN (t1.yymm = '21-01' AND t1.pressing_type_id = 1) THEN t1.input_billet_weight ELSE 0 END) AS '2101_1',
    SUM(CASE WHEN (t1.yymm = '21-01' AND t1.pressing_type_id = 2) THEN t1.input_billet_weight ELSE 0 END) AS '2101_2',
    SUM(CASE WHEN (t1.yymm = '21-01' AND t1.pressing_type_id = 3) THEN t1.input_billet_weight ELSE 0 END) AS '2101_3',
    SUM(CASE WHEN (t1.yymm = '21-02' AND t1.pressing_type_id = 1) THEN t1.input_billet_weight ELSE 0 END) AS '2102_1',
    SUM(CASE WHEN (t1.yymm = '21-02' AND t1.pressing_type_id = 2) THEN t1.input_billet_weight ELSE 0 END) AS '2102_2',
    SUM(CASE WHEN (t1.yymm = '21-02' AND t1.pressing_type_id = 3) THEN t1.input_billet_weight ELSE 0 END) AS '2102_3',
    SUM(CASE WHEN (t1.yymm = '21-03' AND t1.pressing_type_id = 1) THEN t1.input_billet_weight ELSE 0 END) AS '2103_1',
    SUM(CASE WHEN (t1.yymm = '21-03' AND t1.pressing_type_id = 2) THEN t1.input_billet_weight ELSE 0 END) AS '2103_2',
    SUM(CASE WHEN (t1.yymm = '21-03' AND t1.pressing_type_id = 3) THEN t1.input_billet_weight ELSE 0 END) AS '2103_3',
    SUM(CASE WHEN (t1.yymm = '21-04' AND t1.pressing_type_id = 1) THEN t1.input_billet_weight ELSE 0 END) AS '2104_1',
    SUM(CASE WHEN (t1.yymm = '21-04' AND t1.pressing_type_id = 2) THEN t1.input_billet_weight ELSE 0 END) AS '2104_2',
    SUM(CASE WHEN (t1.yymm = '21-04' AND t1.pressing_type_id = 3) THEN t1.input_billet_weight ELSE 0 END) AS '2104_3',
    SUM(CASE WHEN (t1.yymm = '21-05' AND t1.pressing_type_id = 1) THEN t1.input_billet_weight ELSE 0 END) AS '2105_1',
    SUM(CASE WHEN (t1.yymm = '21-05' AND t1.pressing_type_id = 2) THEN t1.input_billet_weight ELSE 0 END) AS '2105_2',
    SUM(CASE WHEN (t1.yymm = '21-05' AND t1.pressing_type_id = 3) THEN t1.input_billet_weight ELSE 0 END) AS '2105_3',
    SUM(CASE WHEN (t1.yymm = '21-06' AND t1.pressing_type_id = 1) THEN t1.input_billet_weight ELSE 0 END) AS '2106_1',
    SUM(CASE WHEN (t1.yymm = '21-06' AND t1.pressing_type_id = 2) THEN t1.input_billet_weight ELSE 0 END) AS '2106_2',
    SUM(CASE WHEN (t1.yymm = '21-06' AND t1.pressing_type_id = 3) THEN t1.input_billet_weight ELSE 0 END) AS '2106_3',
    SUM(CASE WHEN (t1.yymm = '21-07' AND t1.pressing_type_id = 1) THEN t1.input_billet_weight ELSE 0 END) AS '2107_1',
    SUM(CASE WHEN (t1.yymm = '21-07' AND t1.pressing_type_id = 2) THEN t1.input_billet_weight ELSE 0 END) AS '2107_2',
    SUM(CASE WHEN (t1.yymm = '21-07' AND t1.pressing_type_id = 3) THEN t1.input_billet_weight ELSE 0 END) AS '2107_3',
    SUM(CASE WHEN (t1.yymm = '21-08' AND t1.pressing_type_id = 1) THEN t1.input_billet_weight ELSE 0 END) AS '2108_1',
    SUM(CASE WHEN (t1.yymm = '21-08' AND t1.pressing_type_id = 2) THEN t1.input_billet_weight ELSE 0 END) AS '2108_2',
    SUM(CASE WHEN (t1.yymm = '21-08' AND t1.pressing_type_id = 3) THEN t1.input_billet_weight ELSE 0 END) AS '2108_3',
    SUM(CASE WHEN (t1.yymm = '21-09' AND t1.pressing_type_id = 1) THEN t1.input_billet_weight ELSE 0 END) AS '2109_1',
    SUM(CASE WHEN (t1.yymm = '21-09' AND t1.pressing_type_id = 2) THEN t1.input_billet_weight ELSE 0 END) AS '2109_2',
    SUM(CASE WHEN (t1.yymm = '21-09' AND t1.pressing_type_id = 3) THEN t1.input_billet_weight ELSE 0 END) AS '2109_3',
    SUM(CASE WHEN (t1.yymm = '21-10' AND t1.pressing_type_id = 1) THEN t1.input_billet_weight ELSE 0 END) AS '2110_1',
    SUM(CASE WHEN (t1.yymm = '21-10' AND t1.pressing_type_id = 2) THEN t1.input_billet_weight ELSE 0 END) AS '2110_2',
    SUM(CASE WHEN (t1.yymm = '21-10' AND t1.pressing_type_id = 3) THEN t1.input_billet_weight ELSE 0 END) AS '2110_3',
    SUM(CASE WHEN (t1.yymm = '21-11' AND t1.pressing_type_id = 1) THEN t1.input_billet_weight ELSE 0 END) AS '2111_1',
    SUM(CASE WHEN (t1.yymm = '21-11' AND t1.pressing_type_id = 2) THEN t1.input_billet_weight ELSE 0 END) AS '2111_2',
    SUM(CASE WHEN (t1.yymm = '21-11' AND t1.pressing_type_id = 3) THEN t1.input_billet_weight ELSE 0 END) AS '2111_3',
    SUM(CASE WHEN (t1.yymm = '21-12' AND t1.pressing_type_id = 1) THEN t1.input_billet_weight ELSE 0 END) AS '2112_1',
    SUM(CASE WHEN (t1.yymm = '21-12' AND t1.pressing_type_id = 2) THEN t1.input_billet_weight ELSE 0 END) AS '2112_2',
    SUM(CASE WHEN (t1.yymm = '21-12' AND t1.pressing_type_id = 3) THEN t1.input_billet_weight ELSE 0 END) AS '2112_3',
    'dummy'
  FROM 
  (
    SELECT
     t_press.dies_id, 
     DATE_FORMAT(t_press.press_date_at, '%y-%m') AS yymm,
     132.3 * (t_press.billet_length / 1200) * t_press.actual_billet_quantities / 1000 AS input_billet_weight,
     t_press.pressing_type_id,
     'dummy'
    FROM t_press
  ) AS t1
  GROUP BY   t1.dies_id,   'dummy'
) AS press_value
ON m_dies.id = press_value.dies_id
ORDER BY production_data.category1, production_data.category2, production_data.production_number



    ";

    // encoding title into SJIS-win
    foreach( $export_csv_title as $key => $val ){
      $export_header[] = mb_convert_encoding($val, 'SJIS-win', 'UTF-8');
    }
    foreach( $export_csv_title_sub as $key => $val ){
      $export_header_sub[] = mb_convert_encoding($val, 'SJIS-win', 'UTF-8'); // SJISに変換する
      // $export_header_sub[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
    }
    /*
        Make CSV content
     */
    if(touch($file_path)){
      $file = new SplFileObject($file_path, "w");
      // write csv header
      $file->fputcsv($export_header);
      $file->fputcsv($export_header_sub );
      // query database
      $stmt = $dbh->query($export_sql);
      // create csv sentences
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
          $file->fputcsv(mb_convert_encoding($row, 'SJIS-win', 'UTF-8')); // SJISに変換する
      }
    }
    echo json_encode("Made a CSV file");
  }catch(PDOException $e){
    print('Connection failed:'.$e->getMessage());
    die();
  }

    // close database connection
  $dbh = null;
?>