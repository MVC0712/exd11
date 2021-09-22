<?php
  /* 21/05/10作成 */
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
        t_press_directive.id,
        DATE_FORMAT(t_press_directive.plan_date_at, '%y-%m-%d') as plan_date_at
      FROM t_press_directive
      WHERE t_press_directive.dies_id = :targetId
      ORDER BY t_press_directive.plan_date_at DESC, t_press_directive.id  

    ");

    $prepare->bindValue(':targetId', $_POST["targetId"], (INT)PDO::PARAM_INT); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
