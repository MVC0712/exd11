<?php

  $userid = "webuser";
  $passwd = "";
  $targetId = "";
  $pack_date = "";
  $pack_quantity = "";
  $pack_note = "";
  $aging_date = "";
  $hardness_date = "";

  $targetId = $_POST["targetId"];
  $pack_date = $_POST["pack_date"];
  $pack_quantity = $_POST["pack_quantity"];
  $pack_note = $_POST["pack_note"];
  $aging_date = $_POST["aging_date"];
  $hardness_date = $_POST["hardness_date"];

  try{
    $dbh = new PDO(
      'mysql:host=localhost; dbname=extrusion; charset=utf8',
      $userid,
      $passwd,
      array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
      )
    );

    $prepare = $dbh->prepare(
      "UPDATE t_press_plan SET
        aging_date = '$aging_date',
        hardness_date = '$hardness_date',
        pack_plan_date = '$pack_date',
        pack_quantity = '$pack_quantity',
        pack_note = '$pack_note'
      WHERE id = '$targetId'
    ");

    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
