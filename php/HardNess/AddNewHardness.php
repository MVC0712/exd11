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
    $new_8_data = "";
    $new_9_data = "";
    $new_10_data = "";

    $id = $_POST['id'];
    $new_pos = $_POST['new_pos'];
    $new_1_data = $_POST['new_1_data'];
    $new_2_data = $_POST['new_2_data'];
    $new_3_data = $_POST['new_3_data'];
    $new_4_data = $_POST['new_4_data'];
    $new_5_data = $_POST['new_5_data'];
    $new_6_data = $_POST['new_6_data'];
    $new_7_data = $_POST['new_7_data'];
    $new_8_data = $_POST['new_8_data'];
    $new_9_data = $_POST['new_9_data'];
    $new_10_data = $_POST['new_10_data'];
    


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
  $sql="INSERT INTO t_hardness (press_id, position, 1hn, 2hn, 3hn, 4hn, 5hn, 6hn, 7hn, 8hn, 9hn, 10hn) 
  VALUES ('$id', '$new_pos', '$new_1_data', '$new_2_data', '$new_3_data', '$new_4_data', '$new_5_data', '$new_6_data', '$new_7_data', '$new_8_data', '$new_9_data', '$new_10_data')";
// print_r($sql);
    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;