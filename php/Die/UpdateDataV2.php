<?php
  /* 2-7-2023 made */
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
      UPDATE m_dies SET 
        die_number = :die_number,
        production_number_id = :production_number_id,
        die_diamater_id = :die_diamater_id,
        bolstar_id = :bolstar_id,
        hole = :hole,
        arrival_at = :arrival_at,
        die_diameter = :die_diameter,
        updated_at = :updated_at
      WHERE id = :targetId
    ");

      $prepare->bindValue(':die_number', $_POST['die_number'], PDO::PARAM_STR);
      $prepare->bindValue(':production_number_id', (INT)$_POST['production_number_id'], PDO::PARAM_INT);
      $prepare->bindValue(':die_diamater_id', (INT)$_POST['die_diamater__select'], PDO::PARAM_INT);
      $prepare->bindValue(':bolstar_id', (INT)$_POST['bolster__select'], PDO::PARAM_INT);
      $prepare->bindValue(':hole', (INT)$_POST['whole__input'], PDO::PARAM_INT);
      $prepare->bindValue(':arrival_at', $_POST['arrival_date'], PDO::PARAM_STR);
      $prepare->bindValue(':die_diameter', (INT)$_POST['die_diamater__select'], PDO::PARAM_INT);
      $prepare->bindValue(':updated_at', $_POST['today'], PDO::PARAM_STR);
      // $prepare->bindValue(':die_note', $_POST['die_note'], PDO::PARAM_STR);
      $prepare->bindValue(':targetId', (INT)$_POST['targetId'], PDO::PARAM_INT);


      // print_r($sql);
      $prepare->execute();

      echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
