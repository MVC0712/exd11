<?php
  $userid = "webuser";
  $passwd = "";

  $h = $_POST['h'];
  $a = $_POST['a'];
  $b = $_POST['b'];
  $c = $_POST['c'];
  $d = $_POST['d'];
  $e = $_POST['e'];
  $f = $_POST['f'];
  $i = $_POST['i'];
  $k = $_POST['k'];
  $end = $_POST['end'];
  $production_number_id = $_POST['production_number_id'];

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

      $sql = "DELETE FROM m_production_numbers_sub WHERE production_number_id = '$production_number_id'";
      $prepare = $dbh->prepare($sql);
      $prepare->execute();
        
      $sql = "INSERT INTO m_production_numbers_sub
        (production_number_id, h, a, b, c, d, e, f, i, k, end) VALUES 
        ('$production_number_id', '$h', '$a', '$b', '$c', '$d', '$e', '$f', '$i', '$k', '$end')";
      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
