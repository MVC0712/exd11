<?php
  $userid = "webuser";
  $passwd = "";

  $press_id = $_POST['press_id'];
  $order_number = $_POST['order_number'];
  $rack_number = $_POST['rack_number'];
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
  $sql="INSERT INTO t_using_aging_rack (t_press_id, order_number, rack_number, work_quantity)
      VALUES ('$press_id', '$order_number', '$rack_number', '$work_quantity')";
// print_r($sql);
    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;