<?php
  /* 21/08/04作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
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

      $sql = "
      UPDATE t_using_aging_rack
      SET 
        work_quantity = :work_quantity
      WHERE id = :id
      ";

      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':work_quantity', (INT)$_POST['work_quantity'], PDO::PARAM_INT);
      $prepare->bindValue(':id', (INT)$_POST['id'], PDO::PARAM_INT);
      $prepare->execute();
      echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
