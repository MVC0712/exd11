<?php
  $userid = "webuser";
  $passwd = "";

  $input_date = $_POST["input_date"];
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
    m_dies.id, die_number
FROM
    m_dies
        LEFT JOIN
    t_press_plan ON t_press_plan.dies_id = m_dies.id
WHERE
    t_press_plan.plan_date = '$input_date'
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
