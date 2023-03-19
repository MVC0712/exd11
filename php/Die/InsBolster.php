<?php
  /* 19th March 2023 */
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

      $prepare = $dbh->prepare(
          "INSERT INTO m_bolster (
            bolster_name,
            die_diamater,
            created_at
              ) VALUES (
            :bolster_name,
            :die_diamater,
            :created_at
              )"
      );

      $prepare->bindValue(':bolster_name', $_POST['bolster__input'], PDO::PARAM_STR);
      $prepare->bindValue(':die_diamater', $_POST['die_diamater__select'], PDO::PARAM_INT);
      $prepare->bindValue(':created_at', $_POST['today'], PDO::PARAM_STR);
      // $prepare->bindValue(':created_at', $_POST['created_at'], PDO::PARAM_STR);
      // print_r($sql);
      $prepare->execute();

      
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
