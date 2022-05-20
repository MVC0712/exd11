<?php

$userid = "webuser";
$passwd = "";
$start_s = "";
$end_s = "";
$sql ="";
$sql1 = "";
$start_s = $_POST['start_s'];
$end_s = $_POST['end_s'];

  $begin = new DateTime($start_s);
  $end = new DateTime($end_s);
  $end = $end->modify( '+1 day' );
  $interval = DateInterval::createFromDateString('1 day');
  $period = new DatePeriod($begin, $interval, $end);
  foreach ($period as $dt) {
    $di = $dt->format("Y-m-d");
    $din = $dt->format("Ymd");
  }
    $sql2 = "SELECT 
'1' AS o,
t_press_plan.production_number_id AS idd,
m_production_numbers.production_number,
";
    $sql3="";
    foreach ($period as $dtp) {
    $dp = $dtp->format("Y-m-d");
    $dpn = $dtp->format("Ymd");
    $sql3 = $sql3 ." MAX(CASE WHEN 
      t_press_plan.pack_plan_date ='". $dp ."' 
    THEN 
      t_press_plan.pack_quantity else '' END) AS '_". $dpn ."',";
  }
    $sql3 = substr(trim($sql3), 0, -1);
    $sql3 = $sql3." FROM
    t_press_plan
    LEFT JOIN
m_dies ON t_press_plan.dies_id = m_dies.id
    LEFT JOIN
m_production_numbers ON m_production_numbers.id = t_press_plan.production_number_id
    LEFT JOIN
m_pressing_type ON m_pressing_type.id = t_press_plan.pressing_type_id
GROUP BY idd
ORDER BY idd DESC , o ASC;
    ";
    $sql = $sql2.$sql3;
    // print_r($sql);
  try {
      $dbh = new PDO(
          'mysql:host=localhost; dbname=extrusion; charset=utf8',
          $userid,
          $passwd,
          array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
          )
      );

      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);
      
      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;


?>
