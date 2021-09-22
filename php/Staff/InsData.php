<?php
  /* 21/04/20作成 */
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
    "INSERT INTO m_staff (
        emploee_number,
        staff_name,
        position_id,
        created_at,
        leave_at      
      ) VALUES (
        :emploee_number,
        :staff_name,
        :position_id,
        :created_at,
        :leave_at
      )"
    );

$prepare->bindValue(':emploee_number', (INT)$_POST['emploee-number__input'], PDO::PARAM_INT);
$prepare->bindValue(':staff_name', $_POST['name__input'], PDO::PARAM_STR);
$prepare->bindValue(':position_id', (INT)$_POST['position__select'], PDO::PARAM_INT);
$prepare->bindValue(':created_at', $_POST['created_at'], PDO::PARAM_STR);
if($_POST['leave-date__input'] == ''){
  $prepare->bindValue(':leave_at', Null, PDO::PARAM_STR);
}else{
  $prepare->bindValue(':leave_at', $_POST['leave-date__input'], PDO::PARAM_STR);
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
