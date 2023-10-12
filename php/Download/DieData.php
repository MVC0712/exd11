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
        "die number", "production number", "arrival at", "die diamater", "bolster", "die_postition"
      ];
      $export_sql = "
      SELECT 
    m_dies.die_number,
    m_production_numbers.production_number,
    m_dies.arrival_at,
    m_dies_diamater.die_diamater,
    IFNULL(m_bolster.bolster_name, '') AS bolster_name, die_postition
FROM
    m_dies
        LEFT JOIN
    m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
        LEFT JOIN
    m_dies_diamater ON m_dies.die_diamater_id = m_dies_diamater.id
        LEFT JOIN
    m_billet_size ON m_dies.billet_size_id = m_billet_size.id
        LEFT JOIN
    m_bolster ON m_dies.bolstar_id = m_bolster.id
ORDER BY m_dies.die_number
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
