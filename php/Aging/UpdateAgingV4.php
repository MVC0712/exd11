<?php
  /* 21/06/14作成 */
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
      $sql = "UPDATE t_aging
          SET
            aging_date = :aging_date,
            hardness = :hardness,
            start_at = :start_at,
            aging_type = :aging_type,
            update_at = :update_at
          WHERE id = :id";

      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':aging_date', $_POST['aging_date'], PDO::PARAM_STR);
      if ($_POST["start_at"] == "") {
        $prepare->bindValue(':start_at', null, PDO::PARAM_STR);
      } else {
        $prepare->bindValue(':start_at', $_POST["start_at"], PDO::PARAM_STR);
      }
      if ($_POST['hardness'] == '') {
          $prepare->bindValue(':hardness', null, PDO::PARAM_STR);
      } else {
          $prepare->bindValue(':hardness', $_POST['hardness'], PDO::PARAM_STR);
      }
      $prepare->bindValue(':aging_type', (INT)$_POST['aging_type'], PDO::PARAM_INT);
      $prepare->bindValue(':update_at', $_POST['update_at'], PDO::PARAM_STR);
      $prepare->bindValue(':id', (INT)$_POST['id'], PDO::PARAM_INT);
    
      $prepare->execute();

      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
