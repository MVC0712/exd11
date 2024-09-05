<?php
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
    billet_size = :billet_size,
    billet_length = :billet_length,
    press_start_at = :press_start_at,
    press_finish_at = :press_finish_at,
    actual_ram_speed = :actual_ram_speed,
    actual_die_temperature = :actual_die_temperature,
    staff_id = :staff_id,
    billet_temp = :billet_temp,
    bolter_temp = :bolter_temp,
    die_heating_finished = :die_heating_finished,
    die_heating_start = :die_heating_start,
    diering_temp = :diering_temp,
    created_at = :created_at,
    container_upside_stemside_temperature = :container_upside_stemside_temperature,
    container_upside_dieside_temperature = :container_upside_dieside_temperature,
    container_downside_stemside_temperature = :container_downside_stemside_temperature,
    container_downside_dieide_temperature = :container_downside_dieide_temperature,
    press_directive_id = :press_directive_id,
    ordersheet_id = :ordersheet_id,
    special_note = :special_note
    WHERE id = :targetId

    ");
    $prepare->bindValue(':dies_id', (INT)$_POST["dies_id"], PDO::PARAM_INT);
    $prepare->bindValue(':is_washed_die', (INT)$_POST["is_washed_die"], PDO::PARAM_INT);
    $prepare->bindValue(':press_date_at', $_POST["press_date_at"], PDO::PARAM_STR);
    $prepare->bindValue(':pressing_type_id', (INT)$_POST["pressing_type_id"], PDO::PARAM_INT);
    $prepare->bindValue(':press_machine_no', (INT)$_POST["press_machine_no"], PDO::PARAM_INT);
    $prepare->bindValue(':billet_size', (INT)$_POST["billet_size"], PDO::PARAM_INT);
    $prepare->bindValue(':billet_length', (INT)$_POST["billet_length"], PDO::PARAM_INT);
    $prepare->bindValue(':press_start_at', $_POST["press_start_at"], PDO::PARAM_STR);
    $prepare->bindValue(':press_finish_at', $_POST["press_finish_at"], PDO::PARAM_STR);
    $prepare->bindValue(':actual_ram_speed', $_POST["actual_ram_speed"], PDO::PARAM_STR);
    $prepare->bindValue(':actual_die_temperature', (INT)$_POST["actual_die_temperature"], PDO::PARAM_INT);
    $prepare->bindValue(':staff_id', (INT)$_POST["staff_id"], PDO::PARAM_INT);
    $prepare->bindValue(':billet_temp', $_POST['billet_temp'], PDO::PARAM_STR);
    $prepare->bindValue(':bolter_temp', $_POST['bolter_temp'], PDO::PARAM_STR);
    $prepare->bindValue(':die_heating_finished', (INT)$_POST['die_heating_finished'], PDO::PARAM_INT);
    $prepare->bindValue(':die_heating_start', $_POST['die_heating_start'], PDO::PARAM_STR);
    $prepare->bindValue(':diering_temp', $_POST['diering_temp'], PDO::PARAM_STR);
    $prepare->bindValue(':created_at', $_POST['created_at'], PDO::PARAM_STR);
    $prepare->bindValue(':container_upside_stemside_temperature', (INT)$_POST['container_upside_stemside_temperature'], PDO::PARAM_INT);
    $prepare->bindValue(':container_upside_dieside_temperature', (INT)$_POST['container_upside_dieside_temperature'], PDO::PARAM_INT);
    $prepare->bindValue(':container_downside_stemside_temperature', (INT)$_POST['container_downside_stemside_temperature'], PDO::PARAM_INT);
    $prepare->bindValue(':container_downside_dieide_temperature', (INT)$_POST['container_downside_dieide_temperature'], PDO::PARAM_INT);
    if ($_POST['press_directive_id'] == '') {
        $prepare->bindValue(':press_directive_id', null, PDO::PARAM_STR);
    } else {
        $prepare->bindValue(':press_directive_id', (INT)$_POST['press_directive_id'], PDO::PARAM_INT);
    }

    if ($_POST['ordersheet_id'] == '') {
        $prepare->bindValue(':ordersheet_id', null, PDO::PARAM_STR);
    } else {
        $prepare->bindValue(':ordersheet_id', (INT)$_POST['ordersheet_id'], PDO::PARAM_INT);
    }

    if ($_POST['special_note'] == '') {
        $prepare->bindValue(':special_note', null, PDO::PARAM_STR);
    } else {
        $prepare->bindValue(':special_note', $_POST['special_note'], PDO::PARAM_STR);
    }

    $prepare->bindValue(':targetId', (INT)$_POST["targetId"], PDO::PARAM_INT);
      $prepare->execute();

      echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
