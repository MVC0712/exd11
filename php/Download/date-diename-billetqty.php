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

    $file_path = "../../download/date-diename-billetqty.csv";
    $file_path = "../../download/" . $_POST["file_name"] . ".csv";

    $export_csv_title = [
      "date", "die_number", "production_number", "pressing_type", "billet_size", "billet_length", "billet_quantity"
    ]; 
    $export_csv_title_sub = [
      "日付", "型番", "品番", "種別", "ビレットサイズ", "ビレット長さ", "ビレット数"
    ]; 
    $export_sql = "
      SELECT 
        t_press.press_date_at,
        m_dies.die_number,
        m_production_numbers.production_number,
        m_pressing_type.pressing_type,
        t_press.billet_size,
        t_press.billet_length,
        t_press.actual_billet_quantities
      FROM t_press
      LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
      LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
      LEFT JOIN m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
      ORDER BY t_press.press_date_at, t_press.press_start_at
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