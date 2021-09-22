<?php
  /* 21/08/25作成 */
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

      $sql = "
        SELECT 
          t_press_quality.id,
          m_quality_code.quality_code,
          m_quality_code.description_vn,
          t_press_quality.ng_quantities
        FROM t_press_quality
        LEFT JOIN m_quality_code ON t_press_quality.quality_code_id = m_quality_code.id
        WHERE 
          t_press_quality.process_id = 4
          AND
          t_press_quality.using_aging_rack_id = :using_aging_rack_id
      ";

      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':using_aging_rack_id', (INT)$_POST["using_aging_rack_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
