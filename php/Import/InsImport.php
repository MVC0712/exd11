<?php
  $userid = "webuser";
  $passwd = "";

  $ordersheet_number__select = "";
  $quantity = "";
  $import_at = "";
  $note = "";

  $ordersheet_number__select = $_POST['ordersheet_number__select'];
  $quantity = $_POST['quantity'];
  $import_at = $_POST['import_at'];
  $note = $_POST['note'];

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

      $sql = "INSERT INTO t_import (ordersheet_id, quantity, import_at, note
      ) VALUES (
          '$ordersheet_number__select', '$quantity', '$import_at', '$note'
      )";
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
      } catch (PDOException $e) {
          $error = $e->getMessage();
          print_r($error);
      }
  $dbh = null;
  