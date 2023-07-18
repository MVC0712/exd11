<?php
  /* 9th July 23 made */
  $userid = "webuser";
  $passwd = "";
//  $data_json = json_decode($data); 
//  $data_json = array_values($data_json); //配列の並び替え
  // print_r($_POST);
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
    "INSERT INTO m_production_numbers (
        production_number,
        production_category2_id,
        created_at
        ) VALUES (
        :production_number,
        :production_category2_id,
        :created_at
 
        )"
    );

    $prepare->bindValue(':production_number', $_POST['production_number'], PDO::PARAM_STR);
    $prepare->bindValue(':production_category2_id', (INT)$_POST['category2'], PDO::PARAM_INT);
    $prepare->bindValue(':created_at', $_POST['create_at'], PDO::PARAM_STR);

    // $prepare->bindValue(':production_category2_id', (INT)$_POST['production_category2_id'], PDO::PARAM_INT);
    // print_r($sql);
    $prepare->execute();

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
