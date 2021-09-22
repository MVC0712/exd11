<?php
  /* 21/03/16作成 */
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
        m_press_stop_code.id,
        m_press_stop_code.stop_code
      FROM 
        m_press_stop_code
      WHERE stop_code LIKE :stop_code
      ORDER BY m_press_stop_code.stop_code
    ");

    $prepare->bindValue(':stop_code', $_POST["stop_code"], PDO::PARAM_STR); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
