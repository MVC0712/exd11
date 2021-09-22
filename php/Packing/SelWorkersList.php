<?php
  /* 21/09/02作成 */
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

      $sql = "
        SELECT 
          t_packing_worker.id,
          m_staff.staff_name
        FROM t_packing_worker
        LEFT JOIN m_staff ON t_packing_worker.m_staff_id = m_staff.id
        WHERE t_packing_id = :id
        ORDER BY m_staff.position_id DESC,  m_staff.emploee_number
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
