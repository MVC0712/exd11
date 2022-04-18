<?php
  $userid = "webuser";
  $passwd = "";

  $id = "";
  $jug = "";

  $id = $_POST['id'];
  $jug = $_POST['jug'];


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
  $sql="UPDATE t_etching SET 
        1st_jug = $jug1
      WHERE id = $id ";
// print_r($sql);
    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;