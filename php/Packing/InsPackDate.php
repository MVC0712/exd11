<?php
  $userid = "webuser";
  $passwd = "";
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

      $prepare = $dbh->prepare("UPDATE t_press SET packing_check_date = :packing_date WHERE id = :press_id");

      $prepare->bindValue(':press_id', (INT)$_POST['press_id'], PDO::PARAM_INT);
      $prepare->bindValue(':packing_date', $_POST['packing_date'], PDO::PARAM_STR);
      $prepare->execute();
      
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
