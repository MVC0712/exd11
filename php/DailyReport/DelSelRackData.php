<?php
  /* 21/09/10 */

  $userid = "webuser";
  $passwd = "";

  // $vnPdId = $_POST["vnPdId"];
  // print_r($_POST);
  try{
    $dbh = new PDO(
      'mysql:host=localhost; dbname=extrusion; charset=utf8',
      $userid,
      $passwd,
      array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
      )
    );

    $stmt = $dbh->prepare("DELETE FROM t_using_aging_rack WHERE id = :t_using_aging_rack_id");
    $stmt->bindValue(':t_using_aging_rack_id', (INT)$_POST["t_using_aging_rack_id"], PDO::PARAM_INT);
    $stmt->execute();

    echo(json_encode("Deleted"));
  } catch (PDOException $e){
    $error = $e->getMessage();
    // $pdh->rollback();
    print_r($error);
  }
  $dbh = null;
?>
