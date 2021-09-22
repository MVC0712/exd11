<?php
  /* 21/09/02作成 */

  $userid = "webuser";
  $passwd = "";

  // $vnPdId = $_POST["vnPdId"];
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

      $stmt = $dbh->prepare("DELETE FROM t_packing_worker WHERE id=:id");
      $stmt->bindValue(':id', (INT)$_POST["id"], PDO::PARAM_INT);
      $stmt->execute();

      echo(json_encode("Deleted"));
  } catch (PDOException $e) {
      $error = $e->getMessage();
      // $pdh->rollback();
      print_r($error);
  }
  $dbh = null;
