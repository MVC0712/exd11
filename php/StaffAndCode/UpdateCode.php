<?php
  /* 21/06/09作成 */
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

    $prepare = $dbh->prepare("
      update m_quality_code
      set 

        quality_code = :quality_code,
        description_vn = :description_vn,
        description_jp = :description_jp
      
      WHERE id = :targetId
    ");
    $prepare->bindValue(':quality_code', $_POST['quality_code'], PDO::PARAM_STR);
    $prepare->bindValue(':description_vn', $_POST['description_vn'], PDO::PARAM_STR);
    $prepare->bindValue(':targetId', $_POST['targetId'], PDO::PARAM_STR);
    
    if($_POST['description_jp'] == ''){
      $prepare->bindValue(':description_jp', Null, PDO::PARAM_STR);
    }else{
      $prepare->bindValue(':description_jp', $_POST['description_jp'], PDO::PARAM_STR);
    }

    $prepare->execute();

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
