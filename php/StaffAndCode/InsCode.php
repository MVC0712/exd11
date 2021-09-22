<?php
  /* 21/06/10作成 */
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

  $prepare = $dbh->prepare(
    "INSERT INTO m_quality_code (
      quality_code,
      description_vn,
      description_jp,
      created_at
      ) VALUES (
      :quality_code,
      :description_vn,
      :description_jp,
      :created_at
      )"
    );

    $prepare->bindValue(':quality_code', $_POST['quality_code'], PDO::PARAM_STR);
    $prepare->bindValue(':description_vn', $_POST['description_vn'], PDO::PARAM_STR);
    $prepare->bindValue(':created_at', $_POST['created_at'], PDO::PARAM_STR);
    
    if($_POST['description_jp'] == ''){
      $prepare->bindValue(':description_jp', Null, PDO::PARAM_STR);
    }else{
      $prepare->bindValue(':description_jp', $_POST['description_jp'], PDO::PARAM_STR);
    }
    // print_r($sql);
    $prepare->execute();

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
