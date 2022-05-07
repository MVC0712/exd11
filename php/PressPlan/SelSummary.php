<?php
  /* 21/05/17作成 */
  $userid = "webuser";
  $passwd = "";
  $start = "";
  $end = "";

  $start = $_POST['start'];
  $end = $_POST['end'];
  
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
    t_press_plan.id,
    t_press_plan.production_number_id,
    t_press_plan.plan_date,
    m_production_numbers.production_number,
    t_press_plan.dies_id,
    
    t_press_plan.quantity
FROM
    t_press_plan
        LEFT JOIN
    m_dies ON m_dies.id = t_press_plan.dies_id
        LEFT JOIN
    m_production_numbers ON m_production_numbers.id = t_press_plan.production_number_id
WHERE
    t_press_plan.plan_date BETWEEN '$start' AND '$end'
ORDER BY t_press_plan.plan_date DESC
    ");
    $prepare->execute();
    $result = $prepare->fetchALL(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
