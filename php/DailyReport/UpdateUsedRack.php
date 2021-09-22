<?php
  /* 21/09/11 */
  $userid = "webuser";
  $passwd = "";

  $data = file_get_contents('php://input');//POSTされたjsonデータを受け取る
  $data_json = json_decode($data); 

  $selected_id = array_pop($data_json);

  // print_r(count($data_json));

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

    
    if(count($data_json) > 0){ // 値があるときだけ実行する
      foreach($data_json as $val){
        $sql_paramater[] = "({$selected_id}, {$val[1]}, {$val[2]}, {$val[3]})";
      }
      $sql = "INSERT INTO t_using_aging_rack (t_press_id, order_number, rack_number, work_quantity) VALUES ".join(",", $sql_paramater);
      $prepare = $dbh->prepare($sql);
      $prepare->execute();
    }

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
