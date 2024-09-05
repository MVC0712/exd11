<?php
  require_once('../../connection.php');
  $dbh = new DBHandler();
  if ($dbh->getInstance() === null) {
      die("No database connection");
  }
  $data = file_get_contents('php://input');
  $data_json = json_decode($data); 
  $targetId = array_pop($data_json);

  try {
    // if(count($data_json) > 0){
    //   foreach($data_json as $val){
    //     $sql = "UPDATE extrusion.t_using_aging_rack SET drawing_input_id='$targetId', ordinal = '{$val[4]}' WHERE id = '{$val[0]}'";
    //     $stmt = $dbh->getInstance()->prepare($sql);
    //     $stmt->execute();
    //   }
    // }
    if(count($data_json) > 0){
      foreach($data_json as $val){
        $sql = "INSERT INTO tube_drawing.t_used_extrusion_rack 
          (using_aging_rack_id, quantity, drawing_id, ordinal) VALUES 
          ('{$val[0]}','{$val[3]}','$targetId','{$val[4]}')";
        $stmt = $dbh->getInstance()->prepare($sql);
        $stmt->execute();
      }
    }
    echo json_encode("INSERTED");
  } 
  catch(PDOException $e) {
  echo ($e->errorInfo[2]);
  }
?>