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
      update m_staff
      set 
        emploee_number = :emploee_number,
        staff_name = :staff_name,
        position_id = :position_id,
        updated_at = :created_at,
        leave_at = :leave_at
      WHERE id = :targetId
    ");

    $prepare->bindValue(':emploee_number', (INT)$_POST['emploee_number'], PDO::PARAM_INT);
    $prepare->bindValue(':staff_name', $_POST['staff_name'], PDO::PARAM_STR);
    $prepare->bindValue(':position_id', (INT)$_POST['position_id'], PDO::PARAM_INT);
    $prepare->bindValue(':created_at', $_POST['created_at'], PDO::PARAM_STR);

    if($_POST['leave_at'] == ''){
      $prepare->bindValue(':leave_at', Null, PDO::PARAM_STR);
    }else{
      $prepare->bindValue(':leave_at', $_POST['leave_at'], PDO::PARAM_STR);
    }
    $prepare->bindValue(':targetId', (INT)$_POST['targetId'], PDO::PARAM_INT);
    $prepare->execute();

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
