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
  $interval = DateInterval::createFromDateString('1 day');
  $period = new DatePeriod($begin, $interval, $end);
  $sql1 ="";
  $sql1 = "
  SELECT 
    t_press.dies_id AS idm,
    m_dies.die_number, ";

    $sql3="";
    foreach ($period as $dtp) {
    $dp = $dtp->format("Y-m-d");
    $dpn = $dtp->format("Ymd");
    $sql3 = $sql3 ." MAX(CASE WHEN 
      t_press.press_date_at ='". $dp ."' 
    THEN 
      t_press.actual_billet_quantities else '' END) AS '_". $dpn ."',";
  }
    $sql3 = substr(trim($sql3), 0, -1);
    $sql3 = $sql3." FROM
      t_press
    LEFT JOIN
      m_dies ON t_press.dies_id = m_dies.id
    GROUP BY idm
    ORDER BY idm DESC";
    $sql = $sql1.$sql3;
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
