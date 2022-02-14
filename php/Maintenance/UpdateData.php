<?php
  $userid = "webuser";
  $passwd = "";

  $maintenance_start = "";
  $maintenance_finish = "";
  $note = "";
  $line = "";
  $machine = "";
  $part_position = "";
  $file_url = "";
  $targetId = "";

  $maintenance_start = $_POST['maintenance_start'];
  $maintenance_finish = $_POST['maintenance_finish'];
  $note = $_POST['note'];
  $line = $_POST['line'];
  $machine = $_POST['machine'];
  $part_position = $_POST['part_position'];
  $file_url = $_POST['file_url'];
  $targetId = $_POST['targetId'];

  try {
      $dbh = new PDO(
          'mysql:host=localhost; dbname=exd_maintenance; charset=utf8',
          $userid,
          $passwd,
          array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
      )
      );

  $sql="";
  $sql="UPDATE t_maintenance_history SET 
        line_id = '$line',
        part_position_id = '$part_position',
        maintenance_start = '$maintenance_start',
        maintenance_finish = '$maintenance_finish',
        note = '$note',
        file_url = '$file_url'
      WHERE id = $targetId ";

    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
