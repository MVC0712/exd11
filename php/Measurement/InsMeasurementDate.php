<?php
  $userid = "webuser";
  $passwd = "";

  $measurement__date = "";
  $press_id = "";

  $measurement__date = $_POST['measurement__date'];
  $press_id = $_POST['press_id'];

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

    $prepare = $dbh->prepare(
      "UPDATE 
        t_press 
      SET 
      measurement_check_date = '$measurement__date' 
      WHERE 
        id = $press_id
      ");

    $prepare->execute();

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
