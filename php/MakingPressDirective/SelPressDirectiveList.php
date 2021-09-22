<?php
  /* 21/05/18作成 */
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
        t_press_directive.plan_date_at,
        t_press_directive.created_at,
        m_dies.die_number,
        m_pressing_type.pressing_type,
        t_press_directive.billet_input_quantity
      FROM t_press_directive
      LEFT JOIN m_dies ON t_press_directive.dies_id = m_dies.id
      LEFT JOIN m_pressing_type ON t_press_directive.pressing_type_id = m_pressing_type.id
      ORDER BY t_press_directive.plan_date_at DESC
      LIMIT 50;
    ");

    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
