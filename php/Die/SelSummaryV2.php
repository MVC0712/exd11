<?php
  /* 21/04/30作成 */
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
  m_dies.id,
  m_dies.die_number,
  m_dies_diamater.die_diamater,
  IFNULL(m_bolster.bolster_name, '') AS bolster_name,
  m_production_numbers.production_number,
  IFNULL(DATE_FORMAT(m_dies.arrival_at, '%y-%m-%d'), '') AS arrival_at,
  IFNULL(DATE_FORMAT(m_dies.updated_at, '%y-%m-%d'), '') AS updated_at,
  m_dies.hole,
  die_postition
FROM m_dies
LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
LEFT JOIN m_dies_diamater ON m_dies.die_diamater_id = m_dies_diamater.id
LEFT JOIN m_billet_size ON m_dies.billet_size_id = m_billet_size.id
LEFT JOIN m_bolster ON m_dies.bolstar_id = m_bolster.id
WHERE m_dies.die_number LIKE :dieName
ORDER BY die_number
    ");

    $prepare->bindValue(':dieName', $_POST["dieName"], PDO::PARAM_STR); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
