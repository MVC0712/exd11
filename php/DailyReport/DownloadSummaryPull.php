<?php
    $userid = "webuser";
    $passwd = "";

    $start = $_POST['start_date'] ?? '';
    $end = $_POST['end_date'] ?? '';

    if ($start == ""||$end == "") {
      $add = "";
    } else {
      $add = " AND t_pull_press.pull_date BETWEEN '$start' AND '$end'";
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

      $file_path = "../../download/prsdt_stretch.csv";
      $export_csv_title = ["ngay_keo", "ma_khuon", "ma_san_pham", "tu_thanh", "den_thanh", "thoi_gian_bat_dau", "thoi_gian_ket_thuc", "khoang_thoi_gian"];

        $export_sql = "SELECT
    DATE_FORMAT(t_pull_press.pull_date, '%Y-%m-%d') AS pull_date,
    m_dies.die_number,
    m_production_numbers.production_number,
    t_pull_press.pull_no1,
    t_pull_press.pull_no2,
    TIME_FORMAT(t_pull_press.pull_start, '%H:%i') AS pull_start, 
    TIME_FORMAT(t_pull_press.pull_end, '%H:%i') AS pull_end, 
    FLOOR(TIME_TO_SEC(t_pull_press.pull_end) - TIME_TO_SEC(t_pull_press.pull_start)) / 60 AS time_diff_minutes
FROM
    t_pull_press
      LEFT JOIN 
        t_press ON t_pull_press.press_id = t_press.id
      LEFT JOIN
        m_dies ON t_press.dies_id = m_dies.id
      LEFT JOIN
        m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
WHERE 1=1
$add
ORDER BY t_pull_press.pull_date DESC, t_pull_press.pull_start ASC";

      foreach ($export_csv_title as $key => $val) {
          $export_header[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
      }
      if (touch($file_path)) {
          $file = new SplFileObject($file_path, "w");
          $file->fputcsv($export_header);
          $stmt = $dbh->query($export_sql);
          while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Thay thế null thành 'N/A' hoặc chuỗi khác
            if (isset($row['time_diff_minutes'])) {
                $row['time_diff_minutes'] = intval($row['time_diff_minutes']) . " min";
            }
              $file->fputcsv(mb_convert_encoding($row, 'UTF-8', 'UTF-8'));
          }
      }
      echo json_encode("Made a CSV file");
  } catch (PDOException $e) {
      print('Connection failed:'.$e->getMessage());
      die();
  }
  $dbh = null;
