<?php
  /* 21/09/11 */
  $userid = "webuser";
  $passwd = "";

  $bundle = "";
  $quantity = "";
  $lot = "";
  $id = "";

  $bundle = $_POST['bundle'];
  $quantity = $_POST['quantity'];
  $lot = $_POST['lot'];
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

    $sql = "UPDATE t_bundle
              SET 
                bundle = '$bundle',
                quantity = '$quantity',
                lot = '$lot'
            WHERE t_bundle.id = $id
    ";
    // print_r($sql);
    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
