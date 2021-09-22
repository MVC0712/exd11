<?php
  /* 21/06/09作成 */
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
 m_staff.position_id,
 m_staff.leave_at,
 m_staff.updated_at,
 m_staff.joining_date
FROM m_staff
LEFT JOIN m_staff_position ON m_staff.position_id = m_staff_position.id
WHERE m_staff.id = :targetId
    ");

    $prepare->bindValue(':targetId', $_POST["targetId"], (INT)PDO::PARAM_INT); 
    $prepare->execute();
    $result = $prepare->fetch(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
