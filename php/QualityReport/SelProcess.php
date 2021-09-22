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
          m_quality_code_check_process.id,
          m_quality_code_check_process.process_name
        FROM m_quality_code_check_process
        ORDER BY m_quality_code_check_process.id
      ");

      // $prepare->bindValue(':using_aging_rack_id', (INT)$_POST["using_aging_rack_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
