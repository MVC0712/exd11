<?php
  /* 21/06/22作成 */
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

      $sql = "SELECT 
      m_billet_size.billet_size,
      A6061228600,
      A60612281200,
      A6063228600,
      A60632281200,
      A6N01A228600,
      A6N01A2281200
  FROM
      t_checkbillet
          LEFT JOIN
      m_billet_size ON m_billet_size.id = t_checkbillet.billet_size_id,
      (SELECT 
          billet_size_id, MAX(check_at) AS check_at
      FROM
          t_checkbillet
      GROUP BY billet_size_id) max_user
  WHERE
      t_checkbillet.billet_size_id = max_user.billet_size_id
          AND t_checkbillet.check_at = max_user.check_at
  ORDER BY billet_size ASC;";

      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
