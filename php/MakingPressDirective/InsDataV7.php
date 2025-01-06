<?php
  /* 24/12/27 made */
  $userid = "webuser";
  $passwd = "";

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
      cooling_type
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
      :cooling_type
        )"
    );

    $prepare->bindValue(':dies_id', (INT)$_POST["die-number__select"],PDO::PARAM_INT);
    $prepare->bindValue(':plan_date_at' ,$_POST['plan-press-date__input'],PDO::PARAM_STR);
    $prepare->bindValue(':pressing_type_id' ,(INT)$_POST['press-type__select' ],PDO::PARAM_INT);
    $prepare->bindValue(':discard_thickness' ,(INT)$_POST['discard_thickness__input' ],PDO::PARAM_INT);
    $prepare->bindValue(':ram_speed' ,$_POST['ram_speed__input' ],PDO::PARAM_STR);
    $prepare->bindValue(':billet_size' ,(INT)$_POST['billet_size__select' ],PDO::PARAM_INT);
    $prepare->bindValue(':billet_length' ,(INT)$_POST['billet-length__select' ],PDO::PARAM_INT);
    $prepare->bindValue(':billet_input_quantity' ,(INT)$_POST['billet-qty__input' ],PDO::PARAM_INT);
    $prepare->bindValue(':billet_temperature' ,(INT)$_POST['billet-temp__input' ],PDO::PARAM_INT);
    $prepare->bindValue(':billet_taper_heating' ,(INT)$_POST['billet_taper__select' ],PDO::PARAM_INT);
    $prepare->bindValue(':die_temperature' ,(INT)$_POST['die-temp__input' ],PDO::PARAM_INT);
    $prepare->bindValue(':die_heating_time' ,$_POST['die-heat-time__input' ],PDO::PARAM_STR);
    $prepare->bindValue(':stretch_ratio' , $_POST['stretch__input' ],PDO::PARAM_STR);
    $prepare->bindValue(':aiging_type_id' , 1,PDO::PARAM_INT);
    $prepare->bindValue(':previous_press_note' , $_POST['previous-press-note__textarea' ],PDO::PARAM_STR);
    $prepare->bindValue(':created_at' , $_POST['created_at'],PDO::PARAM_STR);
    $prepare->bindValue(':incharge_person_id' ,(INT)$_POST['staff-name__select' ],PDO::PARAM_INT);
    $prepare->bindValue(':nbn' , (INT)$_POST['nBn__select' ],PDO::PARAM_INT);
    $prepare->bindValue(':press_machine' , (INT)$_POST['machine-number__select' ],PDO::PARAM_INT);
    $prepare->bindValue(':cooling_type' , (INT)$_POST['cooling__select' ],PDO::PARAM_INT);

    // print_r($sql);
    $prepare->execute();

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
