<?php
  $userid = "webuser";
  $passwd = "";

  $data = file_get_contents('php://input');
  $data_json = json_decode($data); 

  $production_number_id = array_pop($data_json);

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

    if(count($data_json) > 0){
      foreach($data_json as $val){
        $sql_paramater[] = "('{$production_number_id}', '{$val[0]}', '{$val[1]}', '{$val[2]}', '{$val[3]}')";
      }
      $sql = "INSERT INTO m_measurement_position(production_number_id, pos_on_drawing, value, upper_limit, lower_limit) VALUES ".join(",", $sql_paramater);
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
