<?php
  $userid = "webuser";
  $passwd = "";

  $targetId = $_POST['targetId'];
  $file_url = $_POST['file_url'];
  $file_url = str_replace('#', '', $file_url);

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

      $sql="UPDATE m_production_numbers SET 
        file_url = '$file_url'
      WHERE id = $targetId ";
      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;