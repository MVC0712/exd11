<?php
  /* 21/05/17作成 */
  $userid = "webuser";
  $passwd = "";
  $start = "";
  $end = "";
  $die_number = "";

  $start = $_POST['start'];
  $end = $_POST['end'];
  $die_number = $_POST['die_number'];
  $machine = $_POST['machine'];
  if ($machine == 0) {
    $add = "";
  } else {
    $add = " AND press_machine LIKE '$machine'";
  };
  
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
    press_machine,
    m_production_numbers.production_number,
    m_dies.die_number,
    CASE t_press_plan.shift_id
        WHEN 1 THEN '1'
        WHEN 2 THEN '2'
        WHEN 3 THEN '3'
        WHEN 4 THEN 'HC'
    END AS shift,
    t_press_plan.ordinal,
    t_press_plan.quantity,
    t_press_plan.note
FROM
    t_press_plan
        LEFT JOIN
    m_dies ON m_dies.id = t_press_plan.dies_id
        LEFT JOIN
    m_production_numbers ON m_production_numbers.id = t_press_plan.production_number_id
WHERE
    t_press_plan.plan_date BETWEEN '$start' AND '$end' AND m_dies.die_number LIKE '%$die_number%' $add
ORDER BY t_press_plan.plan_date DESC, press_machine ASC, t_press_plan.shift_id ASC, t_press_plan.ordinal ASC
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
