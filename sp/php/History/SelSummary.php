<?php
  /* 21/07/17作成 */
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
      t_press.id as 1_press_id,
      DATE_FORMAT(t_press.press_date_at, '%d-%m') AS press_date_at,
      LEFT(m_dies.die_number, 12) AS die_number,
      m_production_numbers.production_number,
      m_pressing_type.pressing_type,
      t_press.plan_billet_quantities,
      t_press.actual_billet_quantities,
      (
      SELECT 
      SUM(t_press_work_length_quantity.work_quantity)
      FROM t_press_work_length_quantity
      WHERE t_press_work_length_quantity.press_id = t_press.id
        ) AS profile_quantity
    FROM t_press
    LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
    LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
    LEFT JOIN m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
    WHERE die_number LIKE :die_number
    ORDER BY t_press.press_date_at DESC, t_press.press_start_at
    LIMIT 50
        ";

      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':die_number', $_POST["die_number"], PDO::PARAM_STR);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
