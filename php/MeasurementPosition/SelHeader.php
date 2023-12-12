<?php
  /* 21/08/01作成 */
  $userid = "webuser";
  $passwd = "";
  $production_number_id = $_POST['production_number_id'];
  
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
      id, pos_on_drawing AS Pos, 
      value AS Value,
      ROUND((value + upper_limit), 4) AS Upper, 
      ROUND((value + lower_limit), 4) AS Lower
  FROM
      extrusion.m_measurement_position
  WHERE
  production_number_id = '$production_number_id';
      ");

      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
