<?php
  /* 7th May 2023 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  // print_r($_POST["berfore3Month"]);
  
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
    $prepare = $dbh->prepare("SELECT 
    value, upper_limit, lower_limit
FROM
    extrusion.m_measurement_position
WHERE
    production_number_id = 119;
      ");
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
