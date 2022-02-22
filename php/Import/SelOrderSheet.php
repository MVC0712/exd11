<?php
  $userid = "webuser";
  $passwd = "";
  
  $ordersheet_number = "";
  $ordersheet_number = $_POST['ordersheet_number'];

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
        m_ordersheet.id,
        m_ordersheet.ordersheet_number
      FROM
        m_ordersheet
      WHERE
        m_ordersheet.ordersheet_number LIKE '%$ordersheet_number%'
      ORDER BY issue_date_at DESC , delivery_date_at DESC;
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
