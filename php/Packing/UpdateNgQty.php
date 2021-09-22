<?php
  /* 21/08/29作成 */
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
      update t_press_quality
      set 
        ng_quantities = :ng_quantities
      WHERE id = :id
    ");
    $prepare->bindValue(':id', (INT)$_POST['id'], PDO::PARAM_INT);
      $prepare->bindValue(':ng_quantities', (INT)$_POST['ng_quantities'], PDO::PARAM_INT);
    
      $prepare->execute();

      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
