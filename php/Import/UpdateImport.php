<?php
  $userid = "webuser";
  $passwd = "";

  $import_at = "";
  $ordersheet_number__select = "";
  $quantity = "";
  $note = "";
  $id = "";

  $import_at = $_POST['import_at'];
  $ordersheet_number__select = $_POST['ordersheet_number__select'];
  $quantity = $_POST['quantity'];
  $note = $_POST['note'];
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
      UPDATE t_import SET 
        import_at = '$import_at',
        ordersheet_id = '$ordersheet_number__select',
        quantity = '$quantity',
        note = '$note'
      WHERE id = $id ";

    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
