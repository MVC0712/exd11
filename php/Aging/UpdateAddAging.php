<?php
  /* 21/06/17作成 */
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
      $sql = "UPDATE t_using_aging_rack
          SET
            aging_id = :aging_id
          WHERE id = :id";

      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':aging_id', $_POST['aging_id'], (INT)PDO::PARAM_INT);
      $prepare->bindValue(':id', $_POST['using_aging_rack_id'], (INT)PDO::PARAM_INT);
    
      $prepare->execute();

      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
