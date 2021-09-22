<?php
  /* 21/06/10作成 */
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
        m_quality_code.description_vn,
        IFNULL(m_quality_code.description_jp, '') AS description_jp,
        IFNULL(m_quality_code.description_cn, '') AS description_cn
      FROM m_quality_code
      ORDER BY m_quality_code.quality_code

    ");

      // $prepare->bindValue(':die_number', $_POST["die_number"], PDO::PARAM_STR);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
