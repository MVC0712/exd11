<?php
  $userid = "webuser";
  $passwd = "";

    $id = "";
    $new_pos = "";
    $new_1_data = "";
    $new_2_data = "";
    $new_3_data = "";
    $new_4_data = "";
    $new_5_data = "";
    $new_6_data = "";
    $new_7_data = "";

    $id = $_POST['id'];
    $new_pos = $_POST['new_pos'];
    $new_1_data = $_POST['new_1_data'];
    $new_2_data = $_POST['new_2_data'];
    $new_3_data = $_POST['new_3_data'];
    $new_4_data = $_POST['new_4_data'];
    $new_5_data = $_POST['new_5_data'];
    $new_6_data = $_POST['new_6_data'];
    $new_7_data = $_POST['new_7_data']; 

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

  $sql="";
  $sql="INSERT INTO t_measurement (press_id, position, rz1, die_mark_1, rz2, die_mark_2, rz3, die_mark_3, note) 
  VALUES ('$id', '$new_pos', '$new_1_data', '$new_2_data', '$new_3_data', '$new_4_data', '$new_5_data', '$new_6_data', '$new_7_data')";
// print_r($sql);
    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;