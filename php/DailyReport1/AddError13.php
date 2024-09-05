<?php
  $userid = "webuser";
  $passwd = "";

  $press_id = "";
  $error_code_id = "";
  $start_time = "";
  $end_time = "";
  $err_note = "";

  $press_id = $_POST['press_id'];
  $error_code_id = $_POST['err_code'];
  $start_time = $_POST['err_start'];
  $end_time = $_POST['err_end'];
  $err_note = $_POST['err_note'];
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

      $sql = "INSERT INTO t_error (press_id, error_code_id, start_time, end_time, note
      ) VALUES (
          '$press_id', '$error_code_id', '$start_time', '$end_time', '$err_note'
      )";
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
      } catch (PDOException $e) {
          $error = $e->getMessage();
          print_r($error);
      }
  $dbh = null;
  