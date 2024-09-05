<?php
  /* 21/05/19作成 */
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
      UPDATE m_ordersheet SET
        updated_at = :created_at,
        delivery_date_at = :delivery_date_at,
        note = :note,
        issue_date_at = :issue_date_at,
        ordersheet_number = :ordersheet_number,
        production_numbers_id = :production_number__select,
        production_quantity = :production_quantity
      WHERE id = :targetId
    ");

    $prepare->bindValue(':created_at', $_POST['created_at'], PDO::PARAM_STR);
    $prepare->bindValue(':delivery_date_at', $_POST['delivery_date_at'], PDO::PARAM_STR);
    $prepare->bindValue(':note', $_POST['note'], PDO::PARAM_STR);
    $prepare->bindValue(':issue_date_at', $_POST['issue_date_at'], PDO::PARAM_STR);
    $prepare->bindValue(':ordersheet_number', $_POST['ordersheet_number'], PDO::PARAM_STR);
    $prepare->bindValue(':production_number__select', (INT)$_POST['production_number__select'], PDO::PARAM_INT);
    $prepare->bindValue(':production_quantity', (INT)$_POST['production_quantity'], PDO::PARAM_INT);

    $prepare->bindValue(':targetId', (INT)$_POST['targetId'], PDO::PARAM_INT);

    // print_r($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
