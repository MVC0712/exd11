<?php
  $userid = "webuser";
  $passwd = "";

  $press_id = "";
  $Code = "";
  $time_start = "";
  $time_end = "";
  $time_note = "";
  $time_date = "";

  $press_id = $_POST['press_id'];
  $Code = $_POST['Code'];
  $time_start = $_POST['time_start'];
  $time_end = $_POST['time_end'];
  $time_note = $_POST['time_note'];
  $time_date = $_POST['time_date'];

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

      $sql = "INSERT INTO t_time_press (press_id, Code, time_start, time_end, time_note, time_date
      ) VALUES (
          '$press_id', '$Code', '$time_start', '$time_end', '$time_note', '$time_date'
      )";
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
      } catch (PDOException $e) {
          $error = $e->getMessage();
          print_r($error);
      }
  $dbh = null;
  