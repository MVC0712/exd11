<?php
  /* 21/09/12 */
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
    $sql = "
      SELECT 
        m_dies.id AS m_dies_id,
        m_dies.die_number AS die_number
      FROM m_ordersheet
      LEFT JOIN m_production_numbers ON m_ordersheet.production_numbers_id = m_production_numbers.id
      LEFT JOIN m_dies ON m_dies.production_number_id = m_production_numbers.id
      WHERE m_ordersheet.id = :m_ordersheet_id
    ";
    $prepare = $dbh->prepare($sql);

    $prepare->bindValue(':m_ordersheet_id', $_POST["m_ordersheet_id"], PDO::PARAM_STR); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
