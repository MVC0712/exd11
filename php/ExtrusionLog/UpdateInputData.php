<?php

  $userid = "webuser";
  $passwd = "";
  $targetId = "";
  $production_number_id = "";
  $die_number_id = "";
  $date_plan = "";
  $quantity = "";
  $note = "";

  $targetId = $_POST["targetId"];
  // $production_number_id = $_POST["production_number_id"];
  $die_number_id = $_POST["die_number_id"];
  $date_plan = $_POST["date_plan"];
  $quantity = $_POST["quantity"];
  $note = $_POST["note"];
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
        -- production_number_id = '$production_number_id',
        dies_id = '$die_number_id',
        plan_date = '$date_plan',
        quantity = '$quantity',
        note = '$note'
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
