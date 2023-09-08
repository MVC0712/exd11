<?php
  /* 25th Jun 2023 made */
// add new die
  $userid = "webuser";
  $passwd = "";

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

      $sql = "INSERT INTO m_dies (die_number, production_number_id, die_diamater_id, 
        bolstar_id, hole, arrival_at, created_at, die_postition) 
        VALUES (:die_number, :production_number_id, :die_diamater_id,
        :bolstar_id, :hole, :arrival_at, :created_at, :die_postition)";
      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':die_number', $_POST['die_number'], PDO::PARAM_STR);
      $prepare->bindValue(':die_postition', $_POST['die_postition'], PDO::PARAM_STR);
      $prepare->bindValue(':production_number_id', (INT)$_POST['production_number_id'], PDO::PARAM_INT);
      $prepare->bindValue(':die_diamater_id', (INT)$_POST['die_diamater__select'], PDO::PARAM_INT);
      $prepare->bindValue(':bolstar_id', (INT)$_POST['bolster__select'], PDO::PARAM_INT);
      $prepare->bindValue(':hole', (INT)$_POST['whole__input'], PDO::PARAM_INT);
      $prepare->bindValue(':arrival_at', $_POST['arrival_date'], PDO::PARAM_STR);
      $prepare->bindValue(':created_at', $_POST['today'], PDO::PARAM_STR);
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
