<?php
  /* 21/03/16作成 */
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
          t_press.id,
          DATE_FORMAT(t_press.press_date_at, '%y-%m-%d') AS press_date_at,
          t_press.dies_id,
          m_dies.die_number,
          t_press.is_washed_die,
          t_press.pressing_type_id,
          m_pressing_type.pressing_type,
          t_press.press_machine_no,
          t_press.billet_lot_number,
          t_press.billet_size,
          t_press.billet_length,
          t_press.plan_billet_quantities,
          t_press.actual_billet_quantities,
          t_press.press_stop_cause_id,
          m_press_stop_code.stop_code,
          DATE_FORMAT(t_press.press_start_at, '%H:%m') AS press_start_at,
          DATE_FORMAT(t_press.press_finish_at, '%H:%m') AS press_finish_at,
          t_press.actual_ram_speed,
          t_press.actual_die_temperature,
          t_press.staff_id,
          m_staff.staff_name
      FROM
          t_press
              LEFT JOIN
          m_dies ON t_press.dies_id = m_dies.id
              LEFT JOIN
          m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
              LEFT JOIN
          m_press_stop_code ON t_press.press_stop_cause_id = m_press_stop_code.id
              LEFT JOIN 
          m_staff ON t_press.staff_id = m_staff.id
      WHERE t_press.id = :targetId
    ");

    $prepare->bindValue(':targetId', $_POST["targetId"], (INT)PDO::PARAM_INT); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
