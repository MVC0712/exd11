<?php
  /* 21/04/07作成 */
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

  $prepare = $dbh->prepare(
    "INSERT INTO t_press_directive (
      dies_id,
      plan_date_at,
      pressing_type_id,
      discard_thickness,
      ram_speed,
      billet_size,
      billet_length,
      billet_input_quantity,
      billet_temperature,
      billet_taper_heating,
      die_temperature,
      die_heating_time,
      stretch_ratio,
      aiging_type_id,
      previous_press_note,
      created_at,
      incharge_person_id,
      nbn_id,
      press_machine,
      cooling_type,
      value_l,
      value_m,
      value_n
        ) VALUES (
      :dies_id,
      :plan_date_at,
      :pressing_type_id,
      :discard_thickness,
      :ram_speed,
      :billet_size,
      :billet_length,
      :billet_input_quantity,
      :billet_temperature,
      :billet_taper_heating,
      :die_temperature,
      :die_heating_time,
      :stretch_ratio,
      :aiging_type_id,
      :previous_press_note,
      :created_at,
      :incharge_person_id,
      :nbn,
      :press_machine,
      :cooling_type,
      :value_l,
      :value_m,
      :value_n
        )"
    );

$prepare->bindValue(':dies_id', (INT)$_POST["die-number__select"],PDO::PARAM_INT);
$prepare->bindValue(':plan_date_at' ,$_POST['date__input' ],PDO::PARAM_STR);
$prepare->bindValue(':pressing_type_id' ,(INT)$_POST['pressing-type__select' ],PDO::PARAM_INT);
$prepare->bindValue(':discard_thickness' ,(INT)$_POST['discard-thikness__input' ],PDO::PARAM_INT);
$prepare->bindValue(':ram_speed' ,$_POST['ram-speed__input' ],PDO::PARAM_STR);
$prepare->bindValue(':billet_size' ,(INT)$_POST['billet-size__select' ],PDO::PARAM_INT);
$prepare->bindValue(':billet_length' ,(INT)$_POST['billet-length__select' ],PDO::PARAM_INT);
$prepare->bindValue(':billet_input_quantity' ,(INT)$_POST['billet-input-qty__input' ],PDO::PARAM_INT);
$prepare->bindValue(':billet_temperature' ,(INT)$_POST['billet-temperature__input' ],PDO::PARAM_INT);
$prepare->bindValue(':billet_taper_heating' ,(INT)$_POST['billet-taper-heating__select' ],PDO::PARAM_INT);
$prepare->bindValue(':die_temperature' ,(INT)$_POST['die-temperature__input' ],PDO::PARAM_INT);
$prepare->bindValue(':die_heating_time' ,$_POST['die-heating-time__input' ],PDO::PARAM_STR);
$prepare->bindValue(':stretch_ratio' , $_POST['stretch-ratio__input' ],PDO::PARAM_STR);
$prepare->bindValue(':aiging_type_id' , 1,PDO::PARAM_INT);
$prepare->bindValue(':previous_press_note' , $_POST['note__textarea' ],PDO::PARAM_STR);
$prepare->bindValue(':created_at' , $_POST['created_at'],PDO::PARAM_STR);
$prepare->bindValue(':incharge_person_id' ,(INT)$_POST['incharge__select' ],PDO::PARAM_INT);
$prepare->bindValue(':nbn' , $_POST['nbn__select' ],PDO::PARAM_STR);
$prepare->bindValue(':press_machine' , $_POST['press_machine' ],PDO::PARAM_STR);
$prepare->bindValue(':cooling_type' , $_POST['cooling_type' ],PDO::PARAM_STR);
$prepare->bindValue(':value_l' ,$_POST['sample-position-l__input' ],PDO::PARAM_STR);
$prepare->bindValue(':value_m' ,(INT)$_POST['sample-position-m__input' ],PDO::PARAM_INT);
$prepare->bindValue(':value_n' ,(INT)$_POST['sample-position-n__input' ],PDO::PARAM_INT);


    // print_r($sql);
    $prepare->execute();

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
