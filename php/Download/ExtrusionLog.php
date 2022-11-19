<?php
    $userid = "webuser";
    $passwd = "";
  
    $start = $_POST['start'];
    $end = $_POST['end'];

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
      $export_csv_title = ["Date", "machine_number", "die_number", "pressing_type", "code", "start", "end", "note"];
      $export_sql = "SELECT 
      input_date,
      machine_number,
      die_number,
      m_pressing_type.pressing_type,
      code,
      TIME_FORMAT(start, '%H:%i') AS start,
      TIME_FORMAT(end, '%H:%i') AS end,
      note
      FROM
      t_extrusion_log
          LEFT JOIN
      m_dies ON m_dies.id = t_extrusion_log.die_id
          LEFT JOIN
      m_code ON m_code.id = t_extrusion_log.code_id
          LEFT JOIN
      m_pressing_type ON m_pressing_type.id = t_extrusion_log.pressing_type_id
          WHERE
              t_extrusion_log.input_date BETWEEN '$start' AND '$end'
          ORDER BY t_extrusion_log.input_date DESC, t_extrusion_log.start ASC, t_extrusion_log.end ASC";

      foreach ($export_csv_title as $key => $val) {
          $export_header[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
      }
      if (touch($file_path)) {
          $file = new SplFileObject($file_path, "w");
          $file->fputcsv($export_header);
          $stmt = $dbh->query($export_sql);
          while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
              $file->fputcsv(mb_convert_encoding($row, 'UTF-8', 'UTF-8'));
          }
      }
      echo json_encode("Made a CSV file");
  } catch (PDOException $e) {
      print('Connection failed:'.$e->getMessage());
      die();
  }
  $dbh = null;
