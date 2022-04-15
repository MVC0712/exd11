<?php
  $userid = "webuser";
  $passwd = "";

  $maintenance_start = "";
  $note = "";
  $normal = "";
  $staff = "";
  $line = "";
  $part_position = "";
  $targetId = "";

  $maintenance_start = $_POST['maintenance_start'];
  $note = $_POST['note'];
  $normal = $_POST['normal'];
  $staff = $_POST['staff'];
  $line = $_POST['line'];
  $part_position = $_POST['part_position'];
  $targetId = $_POST['targetId'];

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
  $sql="UPDATE t_maintenance_history SET 
        normal = '$normal',
        line_id = '$line',
        part_position_id = '$part_position',
        staff_id = '$staff',
        maintenance_start = '$maintenance_start',
        note = '$note'
      WHERE id = $targetId ";

    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
