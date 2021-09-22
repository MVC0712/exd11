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
          m_quality_code.id,
          CONCAT(m_quality_code.quality_code, ':' , LEFT(m_quality_code.description_vn, 14)) AS description
        FROM m_quality_code
        ORDER BY m_quality_code.quality_code
      ";

      $prepare = $dbh->prepare($sql);
      // $prepare->bindValue(':t_press_id', (INT)$_POST["t_press_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
