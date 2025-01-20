<?php
  /* 25/01/20 made */
  $userid = "webuser";
  $passwd = "";

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
      update t_press_directive
        set 
          plan_date_at = :plan_date_at,
          pressing_type_id = :pressing_type_id,
          discard_thickness = :discard_thickness,
          ram_speed = :ram_speed,
          billet_size = :billet_size,
          billet_length = :billet_length,
          billet_input_quantity = :billet_input_quantity,
          billet_temperature = :billet_temperature,
          billet_taper_heating = :billet_taper_heating,
          die_temperature = :die_temperature,
          die_heating_time = :die_heating_time,
          stretch_ratio = :stretch_ratio,
          aiging_type_id = :aiging_type_id,
          previous_press_note = :previous_press_note,
          created_at = :created_at,
          incharge_person_id = :incharge_person_id,
          nbn_id = :nbn,
          press_machine = :press_machine,
          cooling_type = :cooling_type
      WHERE id = :target_id
    ");

      $prepare->bindValue(':plan_date_at', $_POST['plan-press-date__input' ], PDO::PARAM_STR);
      $prepare->bindValue(':pressing_type_id', (INT)$_POST['press-type__select' ], PDO::PARAM_INT);
      $prepare->bindValue(':discard_thickness', (INT)$_POST['discard_thickness__input' ], PDO::PARAM_INT);
      $prepare->bindValue(':ram_speed', $_POST['ram_speed__input' ], PDO::PARAM_STR);
      $prepare->bindValue(':billet_size', (INT)$_POST['billet_size__select' ], PDO::PARAM_INT);
      $prepare->bindValue(':billet_length', (INT)$_POST['billet-length__select' ], PDO::PARAM_INT);
      $prepare->bindValue(':billet_input_quantity', (INT)$_POST['billet-qty__input' ], PDO::PARAM_INT);
      $prepare->bindValue(':billet_temperature', (INT)$_POST['billet-temp__input' ], PDO::PARAM_INT);
      $prepare->bindValue(':billet_taper_heating', (INT)$_POST['billet_taper__select' ], PDO::PARAM_INT);
      $prepare->bindValue(':die_temperature', (INT)$_POST['die-temp__input' ], PDO::PARAM_INT);
      $prepare->bindValue(':die_heating_time', $_POST['die-heat-time__input' ], PDO::PARAM_STR);
      // $prepare->bindValue(':bolstar_id', (INT)$_POST['bolster__select' ], PDO::PARAM_INT);
      $prepare->bindValue(':stretch_ratio', $_POST['stretch__input' ], PDO::PARAM_STR);
      $prepare->bindValue(':aiging_type_id', 1, PDO::PARAM_INT);
      $prepare->bindValue(':previous_press_note', $_POST['previous-press-note__textarea' ], PDO::PARAM_STR);
      $prepare->bindValue(':created_at', $_POST['created_at'], PDO::PARAM_STR);
      $prepare->bindValue(':incharge_person_id', (INT)$_POST['staff-name__select' ], PDO::PARAM_INT);
      $prepare->bindValue(':nbn', $_POST['nBn__select' ], PDO::PARAM_STR);
      $prepare->bindValue(':press_machine', $_POST['machine-number__select' ], PDO::PARAM_STR);
      $prepare->bindValue(':cooling_type', $_POST['cooling__select' ], PDO::PARAM_STR);
      $prepare->bindValue(':target_id', (INT)$_POST['target_id' ], PDO::PARAM_INT);

      $prepare->execute();

      echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
