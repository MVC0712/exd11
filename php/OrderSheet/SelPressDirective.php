<?php
  /* June 24 made */
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
        t_press_directive.pressing_type_id,
        t_press_directive.press_machine AS press_machine_no,
        t_press_directive.billet_size AS billet_size__select,
        t_press_directive.billet_length,
        t_press_directive.billet_input_quantity AS plan_billet_quantities,
        t_press_directive.ram_speed AS actual_ram_speed,
        t_press_directive.dies_id
      FROM t_press_directive
      WHERE t_press_directive.id = :targetId
    ");
    $prepare->bindValue(':targetId', $_POST["targetId"], (INT)PDO::PARAM_INT); 
    $prepare->execute();
    $result = $prepare->fetchALL(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
