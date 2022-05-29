<?php
    $userid = "webuser";
    $passwd = "";
    $start = "";
    $end = "";
    $die_number = "";
  
    $start = $_POST['start'];
    $end = $_POST['end'];
    $die_number = $_POST['die_number'];

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
      $export_csv_title = [
        "plan date", "production nuber", "die nuber", "quantity", "note"
      ];
      $export_sql = "

      SELECT 
      t_press_plan.plan_date,
      m_production_numbers.production_number,
      m_dies.die_number,
      t_press_plan.quantity,
      t_press_plan.note
  FROM
      t_press_plan
          LEFT JOIN
      m_dies ON m_dies.id = t_press_plan.dies_id
          LEFT JOIN
      m_production_numbers ON m_production_numbers.id = t_press_plan.production_number_id
  WHERE
      t_press_plan.plan_date BETWEEN '$start' AND '$end' AND m_dies.die_number LIKE '%$die_number%'
  ORDER BY t_press_plan.plan_date DESC
    
        ";

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
