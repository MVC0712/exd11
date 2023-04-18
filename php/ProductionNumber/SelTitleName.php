<?php
  /* 18th Apr 2023 */
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
        m_title_name.english,
        m_title_name.vietnamese,
        m_title_name.japanese
      FROM m_title_name
      ORDER BY m_title_name.id
    ");
      // WHERE m_production_numbers_category1.id != 0

    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
