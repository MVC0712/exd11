<?php
  /* 21/07/26作成 */
  $userid = "webuser";
  $passwd = "";
  $production_number = $_POST['production_number'];
  
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

      $prepare = $dbh->prepare("SELECT 
          *
        FROM m_production_numbers
        WHERE production_number LIKE '%$production_number%'
        ORDER BY production_number ASC");
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
