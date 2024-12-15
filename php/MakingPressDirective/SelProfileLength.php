<?php
  /* 24-12-15 made */
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
          t_press_work_length_quantity.billet_number,
          t_press_work_length_quantity.work_quantity
      FROM
          t_press_work_length_quantity
      WHERE
          t_press_work_length_quantity.press_id = (SELECT 
                  t_press.id
              FROM
                  t_press
              WHERE
                  t_press.press_directive_id = :targetId);
    ");

    $prepare->bindValue(':targetId', $_POST["targetId"], PDO::PARAM_STR); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
