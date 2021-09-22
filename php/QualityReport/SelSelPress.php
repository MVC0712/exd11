<?php
  /* 21/06/12作成 */
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
          t_press.actual_billet_quantities,
          m_staff.staff_name,
          m_pressing_type.pressing_type,
          SUM(CASE billet_number WHEN 1 THEN work_quantity ELSE 0 END) AS 1st_billet_quantity,
          SUM(CASE billet_number WHEN 2 THEN work_quantity ELSE 0 END) AS 2nd_billet_quantity,
          IFNULL(t_press.counted_ok_works, '') AS counted_work_quantity
        FROM t_press
        LEFT JOIN m_staff ON t_press.staff_id = m_staff.id
        LEFT JOIN m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
        LEFT JOIN t_press_work_length_quantity ON t_press_work_length_quantity.press_id = t_press.id
        WHERE t_press.id = :id
        GROUP BY 
          t_press.id,
          t_press.actual_billet_quantities,
          m_staff.staff_name,
          m_pressing_type.pressing_type
    
      ");

      $prepare->bindValue(':id', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetch(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
