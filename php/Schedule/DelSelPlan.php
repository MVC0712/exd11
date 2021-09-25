<?php
  $userid = "webuser";
  $passwd = "";
  $dies_id = "";
  $press_date = "";

  $dies_id = $_POST['dies_id'];
  $press_date = $_POST['press_date'];

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

      $sql = "DELETE FROM t_schedule WHERE dies_id = '$dies_id' AND press_date = '$press_date' ";

      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("DELETED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
