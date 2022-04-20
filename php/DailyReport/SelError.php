<?php
  /* 21/09/11 */
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
      t_error.id,
      error_code,
      TIME_FORMAT(start_time, '%H:%i') AS start_time,
      TIME_FORMAT(end_time, '%H:%i') AS end_time,
      t_error.note
    FROM
      extrusion.t_error
      LEFT JOIN
      m_error_code ON m_error_code.id = t_error.error_code_id
    WHERE
      press_id = :id
    ");

    $prepare->bindValue(':id', $_POST["id"], PDO::PARAM_STR); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
