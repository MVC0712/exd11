<?php
  /* 21/03/18作成 */
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
 m_staff.id,
 m_staff.staff_name,
 m_staff.emploee_number,
 m_staff_position.position,
 m_staff.position_id,
 m_staff.leave_at
FROM m_staff
LEFT JOIN m_staff_position ON m_staff.position_id = m_staff_position.id

    ".$_POST["order"]);

    // $prepare->bindValue(':die_number', $_POST["die_number"], PDO::PARAM_STR); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
