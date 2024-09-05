<?php
  /* 21/05/17作成 */
  $userid = "webuser";
  $passwd = "";
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

    $prepare = $dbh->prepare("
      SELECT t_press.id AS id FROM t_press
    ");
    $prepare->execute();
    $result[0] = $prepare->fetchALL(PDO::FETCH_ASSOC);

    $prepare = $dbh->prepare("
      SHOW COLUMNS FROM t_press
    ");
    $prepare->execute();
    $result[1] = $prepare->fetchALL(PDO::FETCH_ASSOC);

    $prepare = $dbh->prepare("
      SELECT * FROM t_press LIMIT 5
    ");
    $prepare->execute();
    $result[2] = $prepare->fetchALL(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
