<?php
  /* 21/04/05作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  
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
        m_production_numbers.production_number,
        m_production_numbers.specific_weight,
        m_dies_diamater.die_diamater
      FROM 
        m_dies
      LEFT JOIN m_production_numbers on m_dies.production_number_id = m_production_numbers.id
      LEFT JOIN m_dies_diamater ON m_dies.die_diamater_id = m_dies_diamater.id
      WHERE m_dies.id = :dies_id
    ");

    $prepare->bindValue(':dies_id', $_POST["dies_id"], PDO::PARAM_STR); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
