<?php
  /* 21/07/28作成 */
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
          m_quality_code.id,
          m_quality_code.quality_code,
          m_quality_code.description_vn
        FROM 
          m_quality_code
        WHERE
          m_quality_code.quality_code LIKE :ng_code
        ORDER BY m_quality_code.quality_code
      ");

      $prepare->bindValue(':ng_code', $_POST["ng_code"], PDO::PARAM_STR);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
