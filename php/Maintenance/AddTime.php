<?php
  $userid = "webuser";
  $passwd = "";

  $maintenance_record_id = "";
  $time_date = "";
  $time_start = "";
  $time_end = "";
  $time_note = "";

  $maintenance_record_id = $_POST['maintenance_record_id'];
  $time_date = $_POST['time_date'];
  $time_start = $_POST['time_start'];
  $time_end = $_POST['time_end'];
  $time_note = $_POST['time_note'];


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

      $sql = "INSERT INTO t_maintenance_time (maintenance_record_id, time_date, time_start, time_end, time_note
      ) VALUES (
          '$maintenance_record_id', '$time_date', '$time_start', '$time_end', '$time_note'
      )";
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
      } catch (PDOException $e) {
          $error = $e->getMessage();
          print_r($error);
      }
  $dbh = null;
  