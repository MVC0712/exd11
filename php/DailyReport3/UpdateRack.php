<?php
  $userid = "webuser";
  $passwd = "";

  $id = $_POST['id'];
  $rack_number = $_POST['rack_number'];
  $work_quantity = getNull($_POST['work_quantity']);

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

  $sql="";
  $sql="UPDATE t_using_aging_rack SET 
        rack_number = '$rack_number',
        work_quantity = '$work_quantity'
     WHERE t_using_aging_rack.id = $id ";
      
    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;

  function getNull($num) {
    if (($num == 0) || ($num == "")) {
        return null;
    } else {
        return $num;
    }
  }