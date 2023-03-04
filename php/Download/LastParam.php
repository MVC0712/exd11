<?php
// 21/06/18
    $dbname = "vn_pd2";
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

      $file_path = "../../download/" . $_POST["file_name"] . ".csv";
      // print_r($file_path);
      $export_csv_title = [
        "die number", "discard_thickness", "ram_speed", "billet_length", "billet_temperature", "billet_taper_heating", "billet_size", 
        "die_temperature", "die_heating_time", "stretch_ratio", "value_l", "value_m", "value_n", "nbn"
      ];
      $export_sql = "SELECT 
      m_dies.die_number,
      d.discard_thickness,
      d.ram_speed AS ram_spd,
      d.billet_length AS bl_length,
      d.billet_temperature AS bl_temp,
      d.billet_taper_heating AS bt_ht_taper,
      d.billet_size AS bl_size,
      d.die_temperature AS d_temp,
      d.die_heating_time AS d_ht_t,
      d.stretch_ratio AS '%',
      d.value_l,
      d.value_m,
      d.value_n,
      m_nbn.nbn
  FROM
      t_press_directive d
          LEFT JOIN
      m_dies ON d.dies_id = m_dies.id
          LEFT JOIN
      m_pressing_type ON d.pressing_type_id = m_pressing_type.id
          LEFT JOIN
      m_bolster ON d.bolstar_id = m_bolster.id
          LEFT JOIN
      m_staff ON d.incharge_person_id = m_staff.id
          LEFT JOIN
      m_nbn ON d.nbn_id = m_nbn.id
  WHERE
      d.plan_date_at IN (SELECT 
              MAX(d2.plan_date_at)
          FROM
              t_press_directive d2
          WHERE
              d2.dies_id = d.dies_id)
  ;
        ";

      // encoding title into SJIS-win
      foreach ($export_csv_title as $key => $val) {
          $export_header[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
      }
      /*
          Make CSV Part
       */
      if (touch($file_path)) {
          $file = new SplFileObject($file_path, "w");
          // write csv header
          $file->fputcsv($export_header);
          // query database
          $stmt = $dbh->query($export_sql);
          // create csv sentences
          while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
              $file->fputcsv(mb_convert_encoding($row, 'UTF-8', 'UTF-8')); // SJISに変換する
          }
      }
      echo json_encode("Made a CSV file aa");
  } catch (PDOException $e) {
      print('Connection failed:'.$e->getMessage());
      die();
  }

    // close database connection
  $dbh = null;
