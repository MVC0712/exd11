<?php
  $userid = "webuser";
  $passwd = "";
  $dies_id = "";
  $press_date = "";
  $press_quantity ="";

  $dies_id = $_POST['dies_id'];
  $press_date = $_POST['press_date'];
  $press_quantity = $_POST['press_quantity'];

  $today = date("Y-m-d");

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

          $sql_paramater[] = "('$dies_id', '$press_date', '$press_quantity')";
        //   print_r($sql_paramater);

      $sql = "INSERT INTO t_schedule ";
      $sql = $sql."(dies_id, press_date, press_quantity) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
