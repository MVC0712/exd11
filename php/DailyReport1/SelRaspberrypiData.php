<?php
  /* June 24 made */
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
        t_plc_web_log.date_time,
        DATE_FORMAT(t_plc_web_log.date_time, '%Y-%m-%d') AS press_date_at,
        DATE_FORMAT(t_plc_web_log.date_time, '%H:%i') AS press_time_at,
        t_plc_web_log.die_name,
        t_plc_web_log.machine,
        t_plc_web_log.tempdieup AS container_upside_dieside_temperature,
        t_plc_web_log.tempdiedown AS container_downside_dieide_temperature,
        t_plc_web_log.tempstemup AS container_upside_stemside_temperature,
        t_plc_web_log.tempstemdown AS container_downside_stemside_temperature
      FROM t_plc_web_log
      WHERE 
        t_plc_web_log.die_name LIKE :dieName
        AND
      	DATE_FORMAT(t_plc_web_log.date_time, '%Y-%m-%d') = :pressDate
      ORDER BY id desc
      LIMIT 1

    ");

    $prepare->bindValue(':machineNumber', $_POST["machineNumber"], (INT)PDO::PARAM_INT); 
    $prepare->bindValue(':dieName', $_POST["dieName"], PDO::PARAM_STR); 
    $prepare->bindValue(':pressDate', $_POST["pressDate"], PDO::PARAM_STR); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
