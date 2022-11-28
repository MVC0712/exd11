<?php

  $userid = "webuser";
  $passwd = "";
  $ordinal = $_POST["ordinal"];
  $targetId = $_POST["targetId"];
  $die_number_id = $_POST["die_number_id"];
  if(($ordinal == 0) || ($ordinal == "")) {
    $ordinal = null;
  } else {
    $ordinal = $_POST["ordinal"];
  };
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
        dies_id = '$die_number_id',
        ordinal = '$ordinal',
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
