<?php
  /* 21/03/22作成 */
  $userid = "webuser";
  $passwd = "";
//  $data_json = json_decode($data);
//  $data_json = array_values($data_json); //配列の並び替え
//   print_r($_POST);
//   print_r("<br>");
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
    staff_id = :staff_id,
    no1_1000_ram_speed = :no1_1000_ram_speed,
    no1_1000_ram_pressure = :no1_1000_ram_pressure,
    no1_1000_work_temperature = :no1_1000_work_temperature,
    no1_0200_ram_speed = :no1_0200_ram_speed,
    no1_0200_ram_pressure = :no1_0200_ram_pressure,
    no1_0200_work_temperature = :no1_0200_work_temperature,
    no2_1000_ram_speed = :no2_1000_ram_speed,
    no2_1000_ram_pressure = :no2_1000_ram_pressure,
    no2_1000_work_temperature = :no2_1000_work_temperature,
    no2_0200_ram_speed = :no2_0200_ram_speed,
    no2_0200_ram_pressure = :no2_0200_ram_pressure,
    no2_0200_work_temperature = :no2_0200_work_temperature,
    created_at = :created_at,
    container_upside_stemside_temperature = :container_upside_stemside_temperature,
    container_upside_dieside_temperature = :container_upside_dieside_temperature,
    container_downside_stemside_temperature = :container_downside_stemside_temperature,
    container_downside_dieide_temperature = :container_downside_dieide_temperature,
    press_directive_scan_file_name = :press_directive_scan_file_name,
    press_directive_id = :press_directive_id,
    ordersheet_id = :ordersheet_id,
    scrap_weight = :scrap_weight,
    first_actual_length = :first_actual_length
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
      $prepare->bindValue(':scrap_weight', $_POST["scrap_weight__input"], PDO::PARAM_STR);
      $prepare->bindValue(':first_actual_length', $_POST["first_actual_length"], PDO::PARAM_STR);
      $prepare->bindValue(':actual_die_temperature', (INT)$_POST["actual-die-temp__input"], PDO::PARAM_INT);
      $prepare->bindValue(':targetId', (INT)$_POST["targetId"], PDO::PARAM_INT);
      $prepare->bindValue(':staff_id', (INT)$_POST["name__select"], PDO::PARAM_INT);

      $prepare->bindValue(':no1_0200_ram_speed', $_POST['no1_0200_ram_speed'], PDO::PARAM_STR);
      $prepare->bindValue(':no1_0200_ram_pressure', $_POST['no1_0200_ram_pressure'], PDO::PARAM_STR);
      $prepare->bindValue(':no1_0200_work_temperature', (INT)$_POST['no1_0200_work_temperature'], PDO::PARAM_INT);
      $prepare->bindValue(':no1_1000_ram_speed', $_POST['no1_1000_ram_speed'], PDO::PARAM_STR);
      $prepare->bindValue(':no1_1000_ram_pressure', $_POST['no1_1000_ram_pressure'], PDO::PARAM_STR);
      $prepare->bindValue(':no1_1000_work_temperature', (INT)$_POST['no1_1000_work_temperature'], PDO::PARAM_INT);
      // $prepare->bindValue(':no1_work_length', $_POST['no1_work_length'], PDO::PARAM_STR);

      if ($_POST['no2_0200_ram_speed'] == '') {
          $prepare->bindValue(':no2_0200_ram_speed', null, PDO::PARAM_STR);
      } else {
          $prepare->bindValue(':no2_0200_ram_speed', $_POST['no2_0200_ram_speed'], PDO::PARAM_STR);
      }
      if ($_POST['no2_0200_ram_pressure'] == '') {
          $prepare->bindValue(':no2_0200_ram_pressure', null, PDO::PARAM_STR);
      } else {
          $prepare->bindValue(':no2_0200_ram_pressure', $_POST['no2_0200_ram_pressure'], PDO::PARAM_STR);
      }
      if ($_POST['no2_0200_work_temperature'] == '') {
          $prepare->bindValue(':no2_0200_work_temperature', null, PDO::PARAM_STR);
      } else {
          $prepare->bindValue(':no2_0200_work_temperature', $_POST['no2_0200_work_temperature'], PDO::PARAM_STR);
      }

      if ($_POST['no2_1000_ram_speed'] == '') {
          $prepare->bindValue(':no2_1000_ram_speed', null, PDO::PARAM_STR);
      } else {
          $prepare->bindValue(':no2_1000_ram_speed', $_POST['no2_1000_ram_speed'], PDO::PARAM_STR);
      }

      if ($_POST['no2_1000_ram_pressure'] == '') {
          $prepare->bindValue(':no2_1000_ram_pressure', null, PDO::PARAM_STR);
      } else {
          $prepare->bindValue(':no2_1000_ram_pressure', $_POST['no2_1000_ram_pressure'], PDO::PARAM_STR);
      }

      if ($_POST['no2_1000_ram_pressure'] == '') {
          $prepare->bindValue(':no2_1000_work_temperature', null, PDO::PARAM_STR);
      } else {
          $prepare->bindValue(':no2_1000_work_temperature', $_POST['no2_1000_work_temperature'], PDO::PARAM_STR);
      }


      if ($_POST['press_directive_scan_file_name'] == '') {
          $prepare->bindValue(':press_directive_scan_file_name', null, PDO::PARAM_STR);
      } else {
          $prepare->bindValue(':press_directive_scan_file_name', $_POST['press_directive_scan_file_name'], PDO::PARAM_STR);
      }

      if ($_POST['press-directive__select'] == '') {
          $prepare->bindValue(':press_directive_id', null, PDO::PARAM_STR);
      } else {
          $prepare->bindValue(':press_directive_id', (INT)$_POST['press-directive__select'], PDO::PARAM_INT);
      }

      if ($_POST['ordersheet_id'] == '') {
          $prepare->bindValue(':ordersheet_id', null, PDO::PARAM_STR);
      } else {
          $prepare->bindValue(':ordersheet_id', (INT)$_POST['ordersheet_id'], PDO::PARAM_INT);
      }

      $prepare->bindValue(':created_at', $_POST['created_at'], PDO::PARAM_STR);

      $prepare->bindValue(':container_upside_stemside_temperature', (INT)$_POST['container_upside_stemside'], PDO::PARAM_INT);
      $prepare->bindValue(':container_upside_dieside_temperature', (INT)$_POST['container_upside_dieside'], PDO::PARAM_INT);
      $prepare->bindValue(':container_downside_stemside_temperature', (INT)$_POST['container_downside_stemside'], PDO::PARAM_INT);
      $prepare->bindValue(':container_downside_dieide_temperature', (INT)$_POST['container_downside_dieside'], PDO::PARAM_INT);




      // print_r($sql);
      $prepare->execute();

      echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
