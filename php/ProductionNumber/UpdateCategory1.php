<?php
  /* 21/04/28作成 */
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
      update m_production_numbers_category1
        set 
          name_jp = :name_jp
      WHERE id = :target_id
    ");

    $prepare->bindValue(':name_jp' ,$_POST['val' ],PDO::PARAM_STR);
    $prepare->bindValue(':target_id' ,(INT)$_POST['id' ],PDO::PARAM_INT);

    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
