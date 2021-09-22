<?php
  /* 21/09/05 */
  $userid = "webuser";
  $passwd = "";

  $data = file_get_contents('php://input');//POSTされたjsonデータを受け取る
  $data_json = json_decode($data);
  $m_ordersheet_id = array_pop($data_json); // m_ordersheet_idが有るので取得
  // print_r($data_json);
  $today = date('Y/m/d');
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
      // echo "\n";
      // INSERT するための配列の準備
      foreach ($data_json as $val) {
          $sql_paramater[] = "('{$val}', {$m_ordersheet_id}, '{$today}')";
      }
      // print_r($sql_paramater);
      $sql = "INSERT INTO t_packing_box_number ";
      $sql = $sql."(box_number, m_ordersheet_id, created_at) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
      // print_r($sql);
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
