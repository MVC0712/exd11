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
$sql1 = $sql1."
SELECT
  '2' AS o,
  t_press.dies_id,
  m_dies.die_number,
";
  foreach ($period as $dt) {
    $di = $dt->format("Y-m-d");
    $din = $dt->format("Ymd");
    $sql1 = $sql1 ." MAX(CASE WHEN 
      t_press.press_date_at = '" . $di . "' 
    THEN 
      t_press.actual_billet_quantities else '' END) AS '_" . $din ."',";
  }
    $sql2 = substr(trim($sql1), 0, -1);
    $sql2 = $sql2." FROM
      t_press
    LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
    GROUP BY dies_id 
    UNION SELECT 
      '1' AS o,
      t_schedule.dies_id,
      m_dies.die_number, ";
    $sql3="";
    foreach ($period as $dtp) {
    $dp = $dtp->format("Y-m-d");
    $dpn = $dtp->format("Ymd");
    $sql3 = $sql3 ." MAX(CASE WHEN 
      t_schedule.press_date ='". $dp ."' 
    THEN 
      t_schedule.press_quantity else '' END) AS '_". $dpn ."',";
  }
    $sql3 = substr(trim($sql3), 0, -1);
    $sql3 = $sql3." FROM
      t_schedule
    LEFT JOIN
      m_dies ON t_schedule.dies_id = m_dies.id
    GROUP BY dies_id
    ORDER BY dies_id DESC, o ASC";
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
