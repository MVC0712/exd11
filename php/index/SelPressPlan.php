<?php
  /* 7th May 2023 */
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
        t_press_plan.plan_date,
        m_dies.die_number,
        m_pressing_type.pressing_type,
        t_press_plan.quantity
      FROM t_press_plan
      LEFT JOIN m_dies ON t_press_plan.dies_id = m_dies.id
      LEFT JOIN m_pressing_type ON t_press_plan.pressing_type_id = m_pressing_type.id
      ");
      // WHERE t_press_plan.plan_date BETWEEN '2023-2-1' AND '2023-2-28'
      // WHERE m_production_numbers_category1.id != 0

    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
