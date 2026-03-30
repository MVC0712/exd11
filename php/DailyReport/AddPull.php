<?php
  $userid = "webuser";
  $passwd = "";

  $press_id = "";
  $pull_date = "";
  $pull_no1 = "";
  $pull_no2 = "";
  $pull_start = "";
  $pull_end = "";

  $press_id = $_POST['press_id'];
  $pull_date = $_POST['pull_date'];
  $pull_no1 = $_POST['pull_no1'];
  $pull_no2 = $_POST['pull_no2'];
  $pull_start = $_POST['pull_start'];
  $pull_end = $_POST['pull_end'];

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

      $sql = "INSERT INTO t_pull_press (press_id, pull_date, pull_no1, pull_no2, pull_start, pull_end
      ) VALUES (
          '$press_id', '$pull_date','$pull_no1', '$pull_no2', '$pull_start', '$pull_end'
      )";
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
      } catch (PDOException $e) {
          $error = $e->getMessage();
          print_r($error);
      }
  $dbh = null;
  