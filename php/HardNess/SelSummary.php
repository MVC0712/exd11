<?php
  $userid = "webuser";
  $passwd = "";
  $die_number__input = $_POST['die_number__input'];
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
    t_press.id AS press_id,
    DATE_FORMAT(t_press.press_date_at, '%y-%m-%d') AS press_date_at,
    t_press.dies_id,
    m_dies.die_number,
    m_pressing_type.pressing_type,
    t_press.actual_billet_quantities,
    CASE
        WHEN t10.exist > 0 THEN 'Đã lưu'
        ELSE 'C lưu'
    END AS confirm,
    CASE
        WHEN t20.hardness_finish = 1 THEN 'HT'
        ELSE 'CHT'
    END AS XN
FROM
    t_press
        LEFT JOIN
    m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
        LEFT JOIN
    m_dies ON t_press.dies_id = m_dies.id
        LEFT JOIN
    (SELECT 
        t_hardness.press_id, COUNT(*) AS exist
    FROM
        extrusion.t_hardness
    GROUP BY t_hardness.press_id) AS t10 ON t10.press_id = t_press.id
        LEFT JOIN
    (SELECT 
        t_press_sub.press_id, hardness_finish
    FROM
        extrusion.t_press_sub
    GROUP BY t_press_sub.press_id) AS t20 ON t20.press_id = t_press.id
    WHERE
    die_number LIKE '$die_number__input'
ORDER BY t_press.press_date_at DESC , t_press.press_start_at DESC
limit 350;
    ");

      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
