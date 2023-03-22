<?php
  /* Made at 22th March 2023 */
  $userid = "webuser";
  $passwd = "";
//  $data_json = json_decode($data);
//  $data_json = array_values($data_json); //配列の並び替え
  // print_r($_POST);
  // print_r("<br>");
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

      $prepare = $dbh->prepare("
      UPDATE m_bolster SET 
        bolster_name = :bolster_name,
        die_diamater = :die_diamater
      WHERE id = :id
    ");

      $prepare->bindValue(':bolster_name', $_POST['bolster_name'], PDO::PARAM_STR);
      $prepare->bindValue(':die_diamater', (INT)$_POST['die_diamater'], PDO::PARAM_INT);
      $prepare->bindValue(':id', (INT)$_POST['id'], PDO::PARAM_INT);


      // print_r($sql);
      $prepare->execute();

      echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
