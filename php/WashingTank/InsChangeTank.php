<?php
  $userid = "webuser";
  $passwd = "";
  $wasshing_tank = "";
  $naoh_weight = "";
  $gluconat_weight = "";
  $change_staff = "";
  $wasshing_tank_change_at = "";

  $wasshing_tank = $_POST['wasshing_tank'];
  $naoh_weight = $_POST['naoh_weight'];
  $gluconat_weight = $_POST['gluconat_weight'];
  $change_staff = $_POST['change_staff'];
  $wasshing_tank_change_at = $_POST['wasshing_tank_change_at'];

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

    $sql = "INSERT INTO t_washing_tank 
        (wasshing_tank, naoh_weight, gluconat_weight, change_staff, wasshing_tank_change_at
        ) VALUES (
        '$wasshing_tank', '$naoh_weight', '$gluconat_weight', '$change_staff', '$wasshing_tank_change_at'
        )";
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
