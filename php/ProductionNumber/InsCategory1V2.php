<?php
  /* 22th Apr 2023 made */
  $userid = "webuser";
  $passwd = "";
  // print_r("<br>");
  
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
    "INSERT INTO m_production_numbers_category1 (
      name_jp,
      create_at
        ) VALUES (
      :name_jp,
      :create_at
        )"
    );

  $prepare->bindValue(':name_jp',$_POST["name_jp"],PDO::PARAM_STR);
  $prepare->bindValue(':create_at',$_POST["create_at"],PDO::PARAM_STR);

    // print_r($sql);
    $prepare->execute();

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
