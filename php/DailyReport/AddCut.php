<?php
  $userid = "webuser";
  $passwd = "";

  $press_id = "";
  $cut_date = "";
  $cut_no1 = "";
  $cut_no2 = "";
  $cut_start = "";
  $cut_end = "";

  $press_id = $_POST['press_id'];
  $cut_date = $_POST['cut_date'];
  $cut_no1 = $_POST['cut_no1'];
  $cut_no2 = $_POST['cut_no2'];
  $cut_start = $_POST['cut_start'];
  $cut_end = $_POST['cut_end'];

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

      $sql = "INSERT INTO t_cut_press (press_id, cut_date, cut_no1, cut_no2, cut_start, cut_end
      ) VALUES (
          '$press_id', '$cut_date','$cut_no1', '$cut_no2', '$cut_start', '$cut_end'
      )";
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
      } catch (PDOException $e) {
          $error = $e->getMessage();
          print_r($error);
      }
  $dbh = null;
  