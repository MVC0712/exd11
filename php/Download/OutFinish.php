<?php
// 21/05/25 修正
    $dbname = "vn_pd2";
    $userid = "webuser";
    $passwd = "";

  try{
    $dbh = new PDO(
      'mysql:host=localhost; dbname=vn_pd2; charset=utf8',
      $userid,
      $passwd,
      array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false
      )
    );

    $file_path = "../../download/finish.csv";
    $export_csv_title = [
      "date", "emploee_number", "shift", "ordersheet", "production_number", "die_number",
      "proc", "shot_machine", "opration_time", "PQ", "cycle_time", "times_of_run"
    ]; 
    $export_sql = "

      SELECT
        finish.date
        , vn_member.employeenumber
        , finish.shift
        , ordersheet.ordersheetnumber AS ordersheet
        , vn_pn.pn
        , vn_die.DieNo
        , finish_process.process_name AS process_name
        , finish_machine.machine_number 
        , finish_pd.working_hour
        , FORMAT(finish_pd.product_qty, 0) AS product_qty
        , IFNULL(finish_pd.cycle_time, '') AS cycle_time
        , IFNULL(finish_pd.time_of_run, '') AS time_of_run
      FROM 
        finish
      LEFT JOIN finish_pd
        ON finish.id = finish_pd.finish_id
      LEFT JOIN vn_member
        ON finish.emploee_number = vn_member.employeenumber
      LEFT JOIN finish_process
        ON finish_pd.process_id = finish_process.id
      LEFT JOIN ordersheet
        ON finish_pd.ordersheet_id = ordersheet.id
      LEFT JOIN vn_pn
        ON ordersheet.pn_id = vn_pn.id
      LEFT JOIN finish_machine
        ON finish_pd.finish_machine_id = finish_machine.id
      LEFT JOIN vn_die ON finish_pd.die_id = vn_die.id
      ORDER BY 
        finish.date DESC
        , finish.shift
        , finish.emploee_number
        , ordersheet.ordersheetnumber


    ";

    // encoding title into SJIS-win
    foreach( $export_csv_title as $key => $val ){
      $export_header[] = mb_convert_encoding($val, 'SJIS-win', 'UTF-8');
    }
    /*
        Make CSV content
     */
    if(touch($file_path)){
      $file = new SplFileObject($file_path, "w");
      // write csv header
      $file->fputcsv($export_header);
      // query database
      $stmt = $dbh->query($export_sql);
      // create csv sentences
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
          $file->fputcsv($row);
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