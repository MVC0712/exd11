<?php
  $userid = "webuser";
  $passwd = "";
  $production_number= "";
  $production_number = $_POST["production_number"];
  
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
      m_production_numbers.id,
      m_production_numbers.production_number
    FROM
      m_production_numbers
    LEFT JOIN
      m_dies ON m_production_numbers.id = m_dies.production_number_id
    WHERE m_production_numbers.production_number LIKE '%$production_number%' OR m_dies.die_number LIKE '%$production_number%'
    GROUP BY m_production_numbers.id
    ORDER BY m_production_numbers.production_number ASC
    ");

    $prepare->execute();
    $result = $prepare->fetchALL(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
