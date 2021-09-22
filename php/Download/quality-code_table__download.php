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
        "quality_code", "description_vn", "note_vn", "description_jp", "note_jp"
      ];
      $export_csv_title_sub = [
        "品質コード", "内容（ベトナム語）", "説明（ベトナム語）", "内容（日本語）", "内容（日本語）"
      ];
      $export_sql = "

      SELECT 
        m_quality_code.quality_code,
        m_quality_code.description_vn,
        m_quality_code.note_vn,
        m_quality_code.description_jp,
        m_quality_code.note_jp
      FROM m_quality_code
      ORDER BY m_quality_code.id
    
        ";

      // encoding title into SJIS-win
      foreach ($export_csv_title as $key => $val) {
          $export_header[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
      }
      foreach ($export_csv_title_sub as $key => $val) {
          $export_header_sub[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8'); // SJISに変換する
      }
      /*
          Make CSV Part
       */
      if (touch($file_path)) {
          $file = new SplFileObject($file_path, "w");
          // write csv header
          $file->fputcsv($export_header);
          $file->fputcsv($export_header_sub);
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
