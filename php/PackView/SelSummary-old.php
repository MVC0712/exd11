<?php

$userid = "webuser";
$passwd = "";
// $start_s = "";
// $end_s = "";
$start_s = "2021-11-01";
$end_s = "2021-11-30";
// $start_s = $_POST['start_s'];
// $end_s = $_POST['end_s'];

  $begin = new DateTime($start_s);
  $end = new DateTime($end_s);
  $end = $end->modify( '+1 day' );
  $sql ="";
  $sql2 ="";
  $sqls ="";
  $sql1 = "SELECT 
    '1' as o,
    m_dies.id AS idm,
    m_dies.die_number,";
  $interval = DateInterval::createFromDateString('1 day');
  $period = new DatePeriod($begin, $interval, $end);
  foreach ($period as $dt) {
    $di = $dt->format("Y-m-d");
    $din = $dt->format("Ymd");
  $sql1 = $sql1." _" . $din.", ";
  }
  $sql1 = $sql1." Ttr,";
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

    $sqls = $sqls ." MAX(CASE WHEN 
    t_schedule.press_date ='". $di ."' 
    THEN 
    t_schedule.press_quantity else '' END) + ";

  }
    $sqls = substr(trim($sqls), 0, -1);
    $sqls = $sqls ."AS Ttr";
    $sql2 = $sql1 .$sqls;
    // $sql2 = substr(trim($sql1), 0, -1);
    $sql2 = $sql2." FROM
      t_schedule
    LEFT JOIN m_dies ON t_schedule.dies_id = m_dies.id) AS ts ON m_dies.id = ts.dies_id
    GROUP BY idm 
    UNION SELECT 
      '2' as o,
      t_press.dies_id AS idm,
      m_dies.die_number, ";
    $sql3="";
    $sql4="";
    foreach ($period as $dtp) {
    $dp = $dtp->format("Y-m-d");
    $dpn = $dtp->format("Ymd");
    $sql3 = $sql3 ." MAX(CASE WHEN 
      t_press.press_date_at ='". $dp ."' 
    THEN 
      t_press.actual_billet_quantities else '' END) AS '_". $dpn ."',";
    $sql4 = $sql4 ." MAX(CASE WHEN 
      t_press.press_date_at ='". $dp ."' 
    THEN 
      t_press.actual_billet_quantities else '' END) + ";

  }
    // $sql3 = substr(trim($sql3), 0, -1);
    $sql4 = substr(trim($sql4), 0, -1);
    $sql4 = $sql4 ."AS Ttr";
    $sql3 = $sql3 .$sql4;
    $sql3 = $sql3." FROM
      t_press
    LEFT JOIN
      m_dies ON t_press.dies_id = m_dies.id
    GROUP BY idm
    ORDER BY idm DESC, o ASC";
    $sql = $sql2.$sql3;
    print_r($sql);
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