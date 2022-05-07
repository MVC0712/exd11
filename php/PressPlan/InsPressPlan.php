<?php
  $userid = "webuser";
  $passwd = "";
  $production_number_id = "";
  $die_number_id = "";
  $date_plan = "";
  $quantity = "";

  $production_number_id = $_POST["production_number_id"];
  $die_number_id = $_POST["die_number_id"];
  $date_plan = $_POST["date_plan"];
  $quantity = $_POST["quantity"];

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
      "INSERT INTO t_press_plan (
        t_press_plan.production_number_id,
        t_press_plan.dies_id,
        t_press_plan.plan_date,
        t_press_plan.quantity
      ) VALUES (
        '$production_number_id',
        '$die_number_id',
        '$date_plan',
        '$quantity'
      )
    ");

    $prepare->execute();

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
