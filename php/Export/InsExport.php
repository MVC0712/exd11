<?php
  $userid = "webuser";
  $passwd = "";

  $production_number__select = "";
  $quantity = "";
  $export_at = "";
  $note = "";

  $production_number__select = $_POST['production_number__select'];
  $quantity = $_POST['quantity'];
  $export_at = $_POST['export_at'];
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

      $sql = "INSERT INTO t_export (production_number_id, quantity, export_at, note
      ) VALUES (
          '$production_number__select', '$quantity', '$export_at', '$note'
      )";
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
      } catch (PDOException $e) {
          $error = $e->getMessage();
          print_r($error);
      }
  $dbh = null;
  