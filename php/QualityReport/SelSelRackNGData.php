<?php
  /* 21/08/01作成 */
  $userid = "webuser";
  $passwd = "";
//   print_r($_POST);
  
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
            SELECT 
                t_press_quality.id AS t_press_quality_id,
                m_quality_code_check_process.id AS check_process_id,
                m_quality_code_check_process.process_name,
                m_quality_code.quality_code,
                t_press_quality.ng_quantities
            FROM t_press_quality
            LEFT JOIN m_quality_code_check_process ON t_press_quality.process_id = m_quality_code_check_process.id
            LEFT JOIN m_quality_code ON t_press_quality.quality_code_id = m_quality_code.id
            WHERE t_press_quality.using_aging_rack_id = :using_aging_rack_id
            ORDER BY t_press_quality.process_id, m_quality_code.quality_code, t_press_quality.ng_quantities
      ");

      $prepare->bindValue(':using_aging_rack_id', (INT)$_POST["using_aging_rack_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
