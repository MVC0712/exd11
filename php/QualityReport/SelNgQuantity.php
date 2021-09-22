<?php
  /* 21/06/13作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  
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
          t_press_quality.id,
          m_quality_code_check_process.process_name,
          m_quality_code.quality_code,
          m_quality_code.description_vn,
          m_quality_code.description_jp,
          m_quality_code.description_cn,
          t_press_quality.ng_quantities
        FROM t_press_quality 
        LEFT JOIN m_quality_code ON t_press_quality.quality_code_id = m_quality_code.id
        LEFT JOIN m_quality_code_check_process ON t_press_quality.process_id = m_quality_code_check_process.id
        WHERE t_press_quality.press_id = :id
        ORDER BY t_press_quality.id
      ");

      $prepare->bindValue(':id', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
