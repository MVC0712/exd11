<?php
  $userid = "webuser";
  $passwd = "";

  $id = "";
  $id = $_POST['id'];

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


    $stmt = $dbh->prepare("DELETE FROM t_import WHERE id=$id");
    $stmt->execute();

    echo(json_encode("Deleted"));
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
