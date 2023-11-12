<?php
  /* 12th Nov 2023 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  // print_r($_POST["berfore3Month"]);
  
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
      WITH 
      machine_1 AS (
          SELECT
              1 AS comm_key, 
              machine AS machine_number,
              date_time,
              die_name AS die_name_1,
              press_mode
          FROM t_plc_web_log
          WHERE machine = 1
          ORDER BY id desc
          LIMIT 1),
      machine_2 AS (
          SELECT
              1 AS comm_key, 
              machine AS machine_number,
              date_time,
              die_name AS die_name_2,
              press_mode
          FROM t_plc_web_log
          WHERE machine = 2
          ORDER BY id desc
          LIMIT 1
      )
      SELECT 
        machine_1.date_time AS date_time_1,
        machine_1.die_name_1,
        machine_1.press_mode AS machine_1_mode,
        machine_2.date_time AS date_time_2,
        machine_2.die_name_2,
        machine_2.press_mode AS machine_2_mode
      FROM machine_1
      LEFT JOIN machine_2 ON machine_1.comm_key = machine_2.comm_key
    ");
      // WHERE t_press_plan.plan_date BETWEEN '2023-2-1' AND '2023-2-28'
      // WHERE m_production_numbers_category1.id != 0

    // $prepare->bindValue(':before3Month', $_POST["before3Month"], PDO::PARAM_STR);
    // $prepare->bindValue(':after3Month', $_POST["after3Month"], PDO::PARAM_STR);


    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
