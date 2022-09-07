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

  $id = $_POST['id'];
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
  $sql="UPDATE t_measurement SET 
        rz1 = '$new_1_data',
        die_mark_1 = '$new_2_data',
        rz2 = '$new_3_data',
        die_mark_2 = '$new_4_data',
        rz3 = '$new_5_data',
        die_mark_3 = '$new_6_data',
        note = '$new_7_data'
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