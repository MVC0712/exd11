<?php
    $userid = "webuser";
    $passwd = "";
  
    $press_id = $_POST['press_id'];

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
        "Position", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "AVG"
      ];
      $export_sql = "SELECT 
      t10.position,
      t10.1hn,
      t10.2hn,
      t10.3hn,
      t10.4hn,
      t10.5hn,
      t10.6hn,
      t10.7hn,
      t10.8hn,
      t10.9hn,
      t10.10hn,
      ROUND((t10.1hn + t10.2hn + t10.3hn + t10.4hn + t10.5hn + t10.6hn + t10.7hn + t10.8hn + t10.9hn + t10.10hn) / (t10.v1hn + t10.v2hn + t10.v3hn + t10.v4hn + t10.v5hn + t10.v6hn + t10.v7hn + t10.v8hn + t10.v9hn + t10.v10hn),
              1) AS AVGg
  FROM
      (SELECT 
          position,
              1hn,
              2hn,
              3hn,
              4hn,
              5hn,
              6hn,
              7hn,
              8hn,
              9hn,
              10hn,
              CASE
                  WHEN 1hn = '' THEN 0
                  ELSE 1
              END AS v1hn,
              CASE
                  WHEN 2hn = '' THEN 0
                  ELSE 1
              END AS v2hn,
              CASE
                  WHEN 3hn = '' THEN 0
                  ELSE 1
              END AS v3hn,
              CASE
                  WHEN 4hn = '' THEN 0
                  ELSE 1
              END AS v4hn,
              CASE
                  WHEN 5hn = '' THEN 0
                  ELSE 1
              END AS v5hn,
              CASE
                  WHEN 6hn = '' THEN 0
                  ELSE 1
              END AS v6hn,
              CASE
                  WHEN 7hn = '' THEN 0
                  ELSE 1
              END AS v7hn,
              CASE
                  WHEN 8hn = '' THEN 0
                  ELSE 1
              END AS v8hn,
              CASE
                  WHEN 9hn = '' THEN 0
                  ELSE 1
              END AS v9hn,
              CASE
                  WHEN 10hn = '' THEN 0
                  ELSE 1
              END AS v10hn
      FROM
          extrusion.t_hardness
      WHERE
          press_id = $press_id) t10;";

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
