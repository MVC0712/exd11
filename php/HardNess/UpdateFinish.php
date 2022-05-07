<?php
  $userid = "webuser";
  $passwd = "";

  $press_id = "";
  $hardness_finish = "";

  $press_id = $_POST['press_id'];
  $hardness_finish = $_POST['hardness_finish'];

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

  $sql="";
  $sql="UPDATE t_press_sub SET 
        hardness_finish = $hardness_finish
      WHERE press_id = $press_id ";
// print_r($sql);
    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;