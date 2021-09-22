<?php
  /* 21/04/26作成 */
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
      bolstar_id,
      stretch_ratio,
      aiging_type_id,
      previous_press_note,
      created_at,
      incharge_person_id,
      nbn,
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
      :bolstar_id,
      :stretch_ratio,
      :aiging_type_id,
      :previous_press_note,
      :created_at,
      :incharge_person_id,
      :nbn,
      :value_l,
      :value_m,
      :value_n
        )"
    );

$prepare->bindValue(':dies_id', (INT)$_POST["die-number__select"], PDO::PARAM_INT);
$prepare->bindValue(':plan_date_at' ,(INT)$_POST['date__input' ], PDO::PARAM_INT);
$prepare->bindValue(':pressing_type_id' ,(INT)$_POST['pressing-type__select' ], PDO::PARAM_INT);
$prepare->bindValue(':discard_thickness' ,(INT)$_POST['discard-thikness__input' ], PDO::PARAM_INT);
$prepare->bindValue(':ram_speed' ,(INT)$_POST['ram-speed__input' ], PDO::PARAM_INT);
$prepare->bindValue(':billet_size' ,(INT)$_POST['billet-size__select' ], PDO::PARAM_INT);
$prepare->bindValue(':billet_length' ,(INT)$_POST['billet-length__select' ], PDO::PARAM_INT);
$prepare->bindValue(':billet_input_quantity' ,(INT)$_POST['billet-input-qty__input' ], PDO::PARAM_INT);
$prepare->bindValue(':billet_temperature' ,(INT)$_POST['billet-temperature__input' ], PDO::PARAM_INT);
$prepare->bindValue(':billet_taper_heating' ,(INT)$_POST['billet-taper-heating__select' ], PDO::PARAM_INT);
$prepare->bindValue(':die_temperature' ,(INT)$_POST['die-temperature__input' ], PDO::PARAM_INT);
$prepare->bindValue(':die_heating_time' ,(INT)$_POST['die-heating-time__input' ], PDO::PARAM_INT);
$prepare->bindValue(':bolstar_id' ,(INT)$_POST['bolster__select' ], PDO::PARAM_INT);
$prepare->bindValue(':stretch_ratio' ,(INT)$_POST['stretch-ratio__input' ], PDO::PARAM_INT);
$prepare->bindValue(':aiging_type_id' ,(INT)$_POST['hogehoge' ], PDO::PARAM_INT);
$prepare->bindValue(':previous_press_note' ,(INT)$_POST['note__textarea' ], PDO::PARAM_INT);
$prepare->bindValue(':created_at' ,(INT)$_POST['hogehoge' ], PDO::PARAM_INT);
$prepare->bindValue(':incharge_person_id' ,(INT)$_POST['incharge__select' ], PDO::PARAM_INT);
$prepare->bindValue(':nbn' ,(INT)$_POST['nbn__select' ], PDO::PARAM_INT);
$prepare->bindValue(':value_l' ,(INT)$_POST['sample-position-l__input' ], PDO::PARAM_INT);
$prepare->bindValue(':value_m' ,(INT)$_POST['sample-position-m__input' ], PDO::PARAM_INT);
$prepare->bindValue(':value_n' ,(INT)$_POST['sample-position-n__input' ], PDO::PARAM_INT);


    // print_r($sql);
    $prepare->execute();

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
