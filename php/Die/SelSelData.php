<?php
  /* 21/05/06作成 */
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
        m_dies.die_number,
        m_dies.arrival_at,
        m_dies.hole,
        m_dies.die_diamater_id,
        m_dies.bolstar_id,
        m_dies.production_number_id,
        m_dies.die_note
      FROM m_dies
      WHERE m_dies.id = :id
    ");

    $prepare->bindValue(':id', $_POST["id"], (INT)PDO::PARAM_INT); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
