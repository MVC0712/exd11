<?php
  $userid = "webuser";
  $passwd = "";

  $press_id = "";
  $press_id = $_POST['press_id'];
  array_pop($_POST);

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

      foreach ($_POST as $val) {

          $sql_paramater[] = "('{$val}', '$press_id')";
      }

      $sql = "INSERT INTO t_measurement_file ";
      $sql = $sql."(file_url, press_id) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
      // print_r($sql);
      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;