<?php
    $userid = "webuser";
    $passwd = "";

    $start = $_POST['start_date'];
    $end = $_POST['end_date'];
    $die_number = $_POST['die_number'];
    $press_type = $_POST['press_type'];

    if ($start == ""||$end == "") {
      $add = "";
    } else {
      $add = " AND t_press.press_date_at BETWEEN '$start' AND '$end'";
    };
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

      $file_path = "../../download/prsdt.csv";
      $export_csv_title = ["Date", "machine_number", "die_number", "pressing_type", "IsWash", "Ram speed", "Die temp"];

        $export_sql = "SELECT
        DATE_FORMAT(t_press.press_date_at, '%Y-%m-%d') AS press_date,
        t_press.press_machine_no,
        m_dies.die_number,
        CASE t_press.pressing_type_id
            WHEN 1 THEN 'T'
            WHEN 2 THEN 'PT'
            ELSE 'P'
        END AS pressing_type,
        CASE t_press.is_washed_die
            WHEN 1 THEN 'No'
            WHEN 2 THEN 'Yes'
            ELSE ''
        END AS is_washed_die,
        t_press.actual_ram_speed,
        t_press.actual_die_temperature
    FROM
        t_press
            LEFT JOIN
        m_dies ON t_press.dies_id = m_dies.id
        WHERE m_dies.die_number LIKE '%$die_number%'
        $add
              AND pressing_type_id LIKE '%$press_type%'
    ORDER BY t_press.press_date_at DESC";

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
