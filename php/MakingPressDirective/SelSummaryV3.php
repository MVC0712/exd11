<?php
  /* 21/04/05作成 */
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
      t_press_directive.id,
      t_press_directive.dies_id,
      DATE_FORMAT(t_press_directive.plan_date_at, '%y-%m-%d') AS plan_date_at,
      t_press_directive.discard_thickness,
      m_pressing_type.pressing_type,
      t_press_directive.pressing_type_id,
      t_press_directive.ram_speed,
      t_press_directive.billet_length,
      t_press_directive.billet_temperature,
      t_press_directive.billet_taper_heating,
      t_press_directive.die_temperature,
      t_press_directive.die_heating_time,
      m_bolster.bolster_name,
      t_press_directive.bolstar_id,
      t_press_directive.bolstar_id,
      t_press_directive.stretch_ratio,
      m_staff.staff_name,
      t_press_directive.incharge_person_id,
      t_press_directive.value_l,
      t_press_directive.value_m,
      t_press_directive.value_n
      FROM 
      t_press_directive
      LEFT JOIN m_dies ON t_press_directive.dies_id = m_dies.id
      LEFT JOIN m_pressing_type ON t_press_directive.pressing_type_id = m_pressing_type.id
      LEFT JOIN m_bolster ON m_dies.bolstar_id = m_bolster.id
      LEFT JOIN m_staff ON t_press_directive.incharge_person_id = m_staff.id
      WHERE dies_id = :dies_id
      ORDER BY t_press_directive.plan_date_at DESC
    ");

    $prepare->bindValue(':dies_id', $_POST["dies_id"], PDO::PARAM_STR); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
