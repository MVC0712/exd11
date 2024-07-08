<?php
  $userid = "webuser";
  $passwd = "";
  
  $ordersheetnumber = "";
  $ordersheetnumber = $_POST['ordersheetnumber'];

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
      SELECT 
        m_ordersheet.ordersheet_number
      FROM
        m_ordersheet
      WHERE
        m_ordersheet.ordersheet_number = '$ordersheetnumber'");
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
