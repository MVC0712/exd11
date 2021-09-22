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

      $sql = "
      
      SELECT 
      t_nitriding.id,
      m_dies.die_number,
      DATE_FORMAT(t_nitriding.nitriding_date_at, '%y-%m-%d'),
      'dummy'
    FROM t_nitriding
    LEFT JOIN m_dies ON t_nitriding.dies_id = m_dies.id
    WHERE t_nitriding.dies_id = :id
    ORDER BY t_nitriding.nitriding_date_at DESC 
    
        ;
    

      ";

      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':id', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
