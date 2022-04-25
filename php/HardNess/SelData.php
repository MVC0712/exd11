<?php
  $userid = "webuser";
  $passwd = "";
  
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
    SELECT 
      position,
      id,
      1hn, 2hn, 3hn, 4hn, 5hn, 6hn, 7hn, 8hn, 9hn, 10hn
    FROM
      extrusion.t_hardness
    WHERE
      press_id = :press_id ;
      ");

      $prepare->bindValue(':press_id', (INT)$_POST["press_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
