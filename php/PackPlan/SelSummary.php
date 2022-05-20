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
    m_dies.die_number,
    t_press_plan.quantity,
    t_press_plan.aging_date,
    t_press_plan.hardness_date,
    t_press_plan.pack_plan_date,
    t100.max1 * t_press_plan.quantity AS ppl,
    t_press_plan.pack_quantity,
    t_press_plan.pack_note
FROM
    t_press_plan
        LEFT JOIN
    m_dies ON m_dies.id = t_press_plan.dies_id
        LEFT JOIN
    m_production_numbers ON m_production_numbers.id = t_press_plan.production_number_id
        LEFT JOIN
    (SELECT 
        dies_id, max1, max2
    FROM
        t_press_work_length_quantity
    LEFT JOIN t_press ON t_press.id = t_press_work_length_quantity.press_id
    LEFT JOIN (SELECT 
        a1.press_id, max1, MAX(b.work_quantity) AS max2
    FROM
        (SELECT 
        press_id, MAX(work_quantity) AS max1
    FROM
        t_press_work_length_quantity AS a
    GROUP BY press_id) a1
    JOIN t_press_work_length_quantity AS b ON b.press_id = a1.press_id
        AND b.work_quantity != a1.max1
    GROUP BY a1.press_id , a1.max1) ttb ON ttb.press_id = t_press_work_length_quantity.press_id
    WHERE
        max1 > 0
    GROUP BY t_press.dies_id) t100 ON t100.dies_id = t_press_plan.dies_id
    WHERE
    t_press_plan.plan_date BETWEEN '$start' AND '$end' AND m_dies.die_number LIKE '%$die_number%'
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
