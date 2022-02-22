<?php
  $userid = "webuser";
  $passwd = "";

  $export_at = "";
  $production_number__select = "";
  $quantity = "";
  $id = "";

  $export_at = $_POST['export_at'];
  $production_number__select = $_POST['production_number__select'];
  $quantity = $_POST['quantity'];
  $id = $_POST['id'];

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
  $sql="
      UPDATE t_export SET 
        export_at = '$export_at',
        production_number_id = '$production_number__select',
        quantity = '$quantity'
      WHERE id = $id ";

    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
