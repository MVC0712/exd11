<?php
  $param = [];  //prepare
  $userid = "webuser";
  $passwd = "";

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
    // making INSERT data
    foreach($_POST as $val) {
      $param[] = array($val['production_number'], $val['category2_id'], date("Y-m-d"));
    }

    $sql = "INSERT INTO m_production_numbers (production_number, production_category2_id, created_at) VALUES (?, ?, ?)" ;
    $prepare = $dbh->prepare($sql);

    foreach($param as $row){
      $prepare->execute($row);
    }

    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;


?>
