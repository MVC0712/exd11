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
        m_dies.id,
        m_dies.die_number,
        m_production_numbers.production_number
      FROM 
        m_dies
      LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
      WHERE m_dies.die_number LIKE :die_number
      ORDER BY m_dies.die_number
    ");

    $prepare->bindValue(':die_number', $_POST["die_number"], PDO::PARAM_STR); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
