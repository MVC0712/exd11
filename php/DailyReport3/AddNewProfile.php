<?php
  $userid = "webuser";
  $passwd = "";

  $press_id = $_POST['press_id'];
  $billet_number = $_POST['billet_number'];
  $work_length = $_POST['work_length'];
  $stretch_length = $_POST['stretch_length'];
  $work_quantity = $_POST['work_quantity'];

  try {
    $dbh = new PDO('mysql:host=localhost; dbname=extrusion; charset=utf8',
      $userid,
      $passwd,
      array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false
      )
    );

  $sql="";
  $sql="INSERT INTO t_press_work_length_quantity (press_id, billet_number, work_length, stretch_length, work_quantity) 
  VALUES ('$press_id', '$billet_number', '$work_length', '$stretch_length', '$work_quantity')";
// print_r($sql);
    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;