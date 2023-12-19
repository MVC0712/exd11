<?php
  $userid = "webuser";
  $passwd = "";

  $measurement_date = $_POST['measurement_date'];
  $staff_id = $_POST['staff_id'];
  $press_id = $_POST['press_id'];
  $dataS = $_POST['dataS'];
  // print_r($dataS);
  // print_r($measurement_date);
  // print_r($staff_id);
  // print_r($press_id);

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

    if(count($dataS) > 0){
      foreach($dataS as $val){
        $sql_paramater[] = "('{$press_id}', '{$measurement_date}', '{$staff_id}', '{$val["measurement_position_id"]}', '{$val["position"]}', '{$val["value"]}')";
      }
      $sql = "INSERT INTO t_measurement_position(press_id, measurement_date, staff_id, measurement_position_id, position, value) VALUES ".join(",", $sql_paramater);
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
