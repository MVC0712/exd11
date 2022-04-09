<?php
  /* 21/07/19作成 */
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
      t_press.id,
      DATE_FORMAT(t_press.press_date_at, '%m-%d') AS press_date_at,
      t_press.press_machine_no,
      m_dies.die_number,
      m_pressing_type.pressing_type,
      CASE
          WHEN t_press.is_washed_die = 1 THEN 'No'
          WHEN t_press.is_washed_die = 2 THEN 'Yes'
      END AS is_washed,
      t_press.billet_size,
      t_press.billet_length,
      t_press.plan_billet_quantities,
      t_press.actual_billet_quantities,
      DATE_FORMAT(t_press.press_start_at, '%H:%i') AS press_start_at,
      DATE_FORMAT(t_press.press_finish_at, '%H:%i') AS press_finish_at,
      t10.work_quantity,
      IFNULL(t_press.scrap_weight, 0) AS scrap_weight,
      CASE
          WHEN
              ISNULL(t10.work_quantity)
                  OR ISNULL(t10.total_ng)
          THEN
              CASE
                  WHEN
                      t_press.billet_length = 1200
                  THEN
                      ROUND(t_press.actual_billet_quantities * 132.28317,
                              1)
                  ELSE ROUND(t_press.actual_billet_quantities * 66.14158,
                          1)
              END
          ELSE ROUND(m_production_numbers.production_length * m_production_numbers.specific_weight * t10.total_ng + IFNULL(t_press.scrap_weight, 0),
                  1)
      END AS total_scrap
  FROM
      t_press
          LEFT JOIN
      m_dies ON t_press.dies_id = m_dies.id
          LEFT JOIN
      m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
          LEFT JOIN
      m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
          LEFT JOIN
      (SELECT 
          t_using_aging_rack.t_press_id AS t_press_id,
              SUM(t_press_quality.ng_quantities) AS total_ng,
              SUM(t_using_aging_rack.work_quantity) AS work_quantity
      FROM
          t_using_aging_rack
      LEFT JOIN t_press_quality ON t_press_quality.using_aging_rack_id = t_using_aging_rack.id
      LEFT JOIN m_quality_code ON t_press_quality.quality_code_id = m_quality_code.id
      GROUP BY t_using_aging_rack.t_press_id) t10 ON t10.t_press_id = t_press.id
  WHERE
      m_dies.die_number LIKE :die_number
  ORDER BY t_press.press_date_at DESC , t_press.press_start_at DESC;
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
