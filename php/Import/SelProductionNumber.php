<?php
  $userid = "webuser";
  $passwd = "";
  
  $ordersheet_number_id = "";
  $ordersheet_number_id = $_POST['ordersheet_number_id'];

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
    m_production_numbers.production_number
FROM
    m_ordersheet
        LEFT JOIN
    m_production_numbers ON m_production_numbers.id = m_ordersheet.production_numbers_id
WHERE
    m_ordersheet.id = $ordersheet_number_id
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
