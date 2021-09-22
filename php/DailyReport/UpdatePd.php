<?php
  /* 21/03/22作成 */
  $userid = "webuser";
  $passwd = "";
//  $data_json = json_decode($data); 
//  $data_json = array_values($data_json); //配列の並び替え
  // print_r($_POST);
  // print_r("<br>");
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

update t_press 
  set 
    dies_id = :dies_id,
    is_washed_die = :is_washed_die,
    press_date_at = :press_date_at,
    pressing_type_id = :pressing_type_id,
    press_machine_no = :press_machine_no,
    billet_lot_number = :billet_lot_number,
    billet_size = :billet_size,
    billet_length = :billet_length,
    plan_billet_quantities = :plan_billet_quantities,
    actual_billet_quantities = :actual_billet_quantities,
    press_stop_cause_id = :press_stop_cause_id,
    press_start_at = :press_start_at,
    press_finish_at = :press_finish_at,
    actual_ram_speed = :actual_ram_speed,
    actual_die_temperature = :actual_die_temperature,
    staff_id = :staff_id
WHERE id = :targetId


    ");
    $prepare->bindValue(':dies_id', (INT)$_POST["die__select"], PDO::PARAM_INT);
    $prepare->bindValue(':is_washed_die', (INT)$_POST["is-washed__select"], PDO::PARAM_INT);
    $prepare->bindValue(':press_date_at', $_POST["date__input"], PDO::PARAM_STR);
    $prepare->bindValue(':pressing_type_id', (INT)$_POST["pressing-type__select"], PDO::PARAM_INT);
    $prepare->bindValue(':press_machine_no', (INT)$_POST["machine-number__select"], PDO::PARAM_INT);
    $prepare->bindValue(':billet_lot_number', $_POST["billet-lot-number__input"], PDO::PARAM_STR);
    $prepare->bindValue(':billet_size', (INT)$_POST["billet-size__select"], PDO::PARAM_INT);
    $prepare->bindValue(':billet_length', (INT)$_POST["billet-length__select"], PDO::PARAM_INT);

    $prepare->bindValue(':plan_billet_quantities', (INT)$_POST["plan-billet-qty__input"], PDO::PARAM_INT);
    $prepare->bindValue(':actual_billet_quantities', (INT)$_POST["actual-billet-qty__input"], PDO::PARAM_INT);
    
    $prepare->bindValue(':press_stop_cause_id', (INT)$_POST["stop-cause__select"], PDO::PARAM_INT);
    $prepare->bindValue(':press_start_at', $_POST["press-start__input"], PDO::PARAM_STR);
    $prepare->bindValue(':press_finish_at', $_POST["press-finish__input"], PDO::PARAM_STR);

    $prepare->bindValue(':actual_ram_speed', $_POST["actual-ram-speed__input"], PDO::PARAM_STR);
    $prepare->bindValue(':actual_die_temperature', (INT)$_POST["actual-die-temp__input"], PDO::PARAM_INT);

    $prepare->bindValue(':targetId', (INT)$_POST["targetId"], PDO::PARAM_INT);

    $prepare->bindValue(':staff_id', (INT)$_POST["name__select"], PDO::PARAM_INT);

    // print_r($sql);
    $prepare->execute();

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
