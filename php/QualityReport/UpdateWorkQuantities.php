<?php
  /* 21/07/27作成 */
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
      UPDATE t_press_quality
      SET 
        process_id = :process_id,
        quality_code_id = :quality_code_id,
        ng_quantities = :ng_quantities
      WHERE id = :id
      ";

      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':process_id', (INT)$_POST['process_id'], PDO::PARAM_INT);
      $prepare->bindValue(':quality_code_id', (INT)$_POST['quality_code_id'], PDO::PARAM_INT);
      $prepare->bindValue(':ng_quantities', (INT)$_POST['ng_quantities'], PDO::PARAM_INT);
      $prepare->bindValue(':id', (INT)$_POST['id'], PDO::PARAM_INT);
      $prepare->execute();
      echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
