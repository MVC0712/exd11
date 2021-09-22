<?php
  /* 21/07/17作成 */
// 金型を新規登録する
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
        bolstar_id, hole, arrival_at, created_at) 
        VALUES (:die_number, :production_number_id, :die_diamater_id,
        :bolstar_id, :hole, :arrival_at, :created_at)";
      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':die_number', $_POST['die_number'], PDO::PARAM_STR);
      $prepare->bindValue(':production_number_id', (INT)$_POST['production_number_id'], PDO::PARAM_INT);
      $prepare->bindValue(':die_diamater_id', (INT)$_POST['die_diamater_id'], PDO::PARAM_INT);
      $prepare->bindValue(':bolstar_id', (INT)$_POST['bolstar_id'], PDO::PARAM_INT);
      $prepare->bindValue(':hole', (INT)$_POST['hole'], PDO::PARAM_INT);
      $prepare->bindValue(':arrival_at', $_POST['arrival_at'], PDO::PARAM_STR);
      $prepare->bindValue(':created_at', $_POST['today'], PDO::PARAM_STR);
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
