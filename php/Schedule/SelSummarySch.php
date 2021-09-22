<?php

$userid = "webuser";
$passwd = "";
$start_s = "";
$end_s = "";

$start_s = $_POST['start_s'];
$end_s = $_POST['end_s'];

  $begin = new DateTime($start_s);
  $end = new DateTime($end_s);
  $end = $end->modify( '+1 day' );
  $sql ="";
  $sql1 = "SELECT 
    m_dies.id AS idm,
    m_dies.die_number,";
  $interval = DateInterval::createFromDateString('1 day');
  $period = new DatePeriod($begin, $interval, $end);
  foreach ($period as $dt) {
    $di = $dt->format("Y-m-d");
    $din = $dt->format("Ymd");
  $sql1 = $sql1." _" . $din.", ";
  }
  $sql1 = substr(trim($sql1), 0, -1);
$sql1 = $sql1." FROM
    m_dies
  LEFT JOIN
  (SELECT 
    t_schedule.dies_id,
    m_dies.die_number,
";

  foreach ($period as $dt) {
    $di = $dt->format("Y-m-d");
    $din = $dt->format("Ymd");
    $sql1 = $sql1 ." CASE WHEN 
      t_schedule.press_date = '" . $di . "' 
    THEN 
      t_schedule.press_quantity else '' END AS '_" . $din ."',";
  }
    $sql2 = substr(trim($sql1), 0, -1);
    $sql2 = $sql2." FROM
      t_schedule
    LEFT JOIN m_dies ON t_schedule.dies_id = m_dies.id) AS ts ON m_dies.id = ts.dies_id
    GROUP BY idm
    ORDER BY idm DESC";
    $sql = $sql2;
    // echo $sql;
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
