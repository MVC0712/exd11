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
            t_checkbillet.id,
            DATE_FORMAT(t_checkbillet.check_at, '%y-%m-%d') AS a,
            m_staff.staff_name,
            CONCAT(m_billet_size.billet_size, ' Inch'),
            t_checkbillet.A60612281200,
            t_checkbillet.A6061228600,
            t_checkbillet.A60632281200,
            t_checkbillet.A6063228600,
            t_checkbillet.A6N012281200,
            t_checkbillet.A6N01228600,
            t_checkbillet.A6N01A2281200,
            t_checkbillet.A6N01A228600,
            t_checkbillet.A60612281200_vn,
            t_checkbillet.A6061228600_vn,
            t_checkbillet.A60632281200_vn,
            t_checkbillet.A6063228600_vn,
            t_checkbillet.A6N01A2281200_vn,
            t_checkbillet.A6N01A228600_vn
        FROM
            extrusion.t_checkbillet
        LEFT JOIN
            m_staff ON m_staff.id = t_checkbillet.staff_id
        LEFT JOIN
            m_billet_size ON m_billet_size.id = t_checkbillet.billet_size_id
        ORDER BY check_at DESC, created_at DESC;
        ";

      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
