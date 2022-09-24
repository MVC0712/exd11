<?php
  $userid = "webuser";
  $passwd = "";

  $id = "";
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
  $sql="UPDATE t_hardness SET 
        1hn = '$new_1_data',
        2hn = '$new_2_data',
        3hn = '$new_3_data',
        4hn = '$new_4_data',
        5hn = '$new_5_data',
        6hn = '$new_6_data',
        7hn = '$new_7_data',
        8hn = '$new_8_data',
        9hn = '$new_9_data',
        10hn = '$new_10_data'
      WHERE id = $id ";
// print_r($sql);
    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;