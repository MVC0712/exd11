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
  DATE_FORMAT(t_press.press_date_at, '%m-%d') AS press_date,
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
  TIME_FORMAT(t_press.press_start_at, '%H:%i') AS press_start_at,
  TIME_FORMAT(t_press.press_finish_at, '%H:%i') AS press_finish_at,
  (
    SELECT
      SUM(t_press_work_length_quantity.work_quantity)
    FROM
      t_press_work_length_quantity
    WHERE
      t_press_work_length_quantity.press_id = t_press.id
    GROUP BY
      t_press_work_length_quantity.press_id
  ) AS pressed_profile_number,
  (
  SELECT
    SUM(
      CASE
        WHEN t_press_work_length_quantity.billet_number = 1 THEN t_press_work_length_quantity.work_quantity
        ELSE 0
      END
    ) AS 1st_billet_profile_quantity
  FROM
    t_press_work_length_quantity
  WHERE
    t_press_work_length_quantity.press_id = t_press.id
) + (
  SELECT
    SUM(
      CASE
        WHEN t_press_work_length_quantity.billet_number = 2 THEN t_press_work_length_quantity.work_quantity
        ELSE 0
      END
    ) AS 2nd_billet_profile_quantity
  FROM
    t_press_work_length_quantity
  WHERE
    t_press_work_length_quantity.press_id = t_press.id
) * (t_press.actual_billet_quantities - 1) AS caliculated_profile_number
FROM
  t_press
  LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
  LEFT JOIN m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
  LEFT JOIN t_press_work_length_quantity ON t_press_work_length_quantity.press_id = t_press.id
      WHERE m_dies.die_number LIKE :die_number
GROUP BY
  t_press.id
ORDER BY
  press_date_at DESC,
  t_press.press_start_at

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
