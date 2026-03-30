<?php
  $userid = "webuser";
  $passwd = "";

  $press_id = "";
  $bundle = "";
  $quantity = "";
  $lot = "";

  $press_id = $_POST['press_id'];
  $bundle = $_POST['bundle_no'];
  $quantity = $_POST['quantity'];
  $lot = $_POST['lot_no'];
  $mfg = $_POST['mfg'];
  $insp = $_POST['insp'];
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

      $sql = "INSERT INTO t_bundle (press_id, bundle, quantity, lot, mfg, insp, note
      ) VALUES (
          '$press_id', '$bundle', '$quantity', '$lot', '$mfg', '$insp', '$note'
      )";
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
      } catch (PDOException $e) {
          $error = $e->getMessage();
          print_r($error);
      }
  $dbh = null;
  