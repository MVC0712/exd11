<?php
  /* 21/06/22作成 */
  $userid = "webuser";
  $passwd = "";
  $dies_id = $_POST['dies_id'] ?? '';

  try {
      $dbh = new PDO(
          'mysql:host=localhost; dbname=extrusion; charset=utf8',
          $userid,
          $passwd,
          [
              PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
              PDO::ATTR_EMULATE_PREPARES => false
          ]
      );

      // Set user variables
      $vars = [
          "set @washing_die_status = 4",
          "set @specific_grabity_of_alminium = 2.70",
          "set @pi = 3.141459",
          "set @inch = 25.4"
      ];
      foreach ($vars as $var) {
          $dbh->exec($var);
      }

      $sql = "
WITH
  latest_nitriding_date_by_dies_id AS (
    SELECT
      m_dies.id AS dies_id,
      IFNULL(MAX(t10.nitriding_date_at), DATE('2021-01-01')) AS nitriding_date_at
    FROM m_dies
    LEFT JOIN t_nitriding t10 ON m_dies.id = t10.dies_id
    GROUP BY m_dies.id
  ),
  profile_length_after_nitriding_by_dies_id AS (
    SELECT 
      t_press.dies_id,
      CAST(ROUND(SUM(((@pi * POWER(t_press.billet_size * @inch / 2, 2) 
        * t_press.billet_length * 0.001 * @specific_grabity_of_alminium
        * t_press.actual_billet_quantities / 1000) 
        / specific_weight / 1000 / m_dies.hole)), 2) AS CHAR) AS length_km_after_nitriding
    FROM latest_nitriding_date_by_dies_id
    LEFT JOIN t_press ON t_press.dies_id = latest_nitriding_date_by_dies_id.dies_id
    LEFT JOIN m_dies ON latest_nitriding_date_by_dies_id.dies_id = m_dies.id
    LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
    WHERE t_press.press_date_at > latest_nitriding_date_by_dies_id.nitriding_date_at
    GROUP BY t_press.dies_id
  ),
  washing_count_after_nitriding_by_dies_id AS (
    SELECT 
      t_dies_status.dies_id,
      COUNT(*) AS washing_count_after_nitriding
    FROM t_dies_status
    LEFT JOIN latest_nitriding_date_by_dies_id ON t_dies_status.dies_id = latest_nitriding_date_by_dies_id.dies_id
    WHERE t_dies_status.die_status_id = @washing_die_status
      AND t_dies_status.do_sth_at > latest_nitriding_date_by_dies_id.nitriding_date_at
    GROUP BY t_dies_status.dies_id
  ),
  latest_die_status AS (
    SELECT 
      t_dies_status.dies_id, 
      t_dies_status.die_status_id,
      m_die_status.die_status,
      MAX(t_dies_status.do_sth_at) AS max_do_sth_at
    FROM t_dies_status
    LEFT JOIN m_die_status ON t_dies_status.die_status_id = m_die_status.id
    GROUP BY t_dies_status.dies_id
  )
SELECT 
  t_press.dies_id AS did,
  m_dies.die_number AS dnb,
  SUM(CASE
      WHEN CONCAT(t_press.press_date_at, ' ', DATE_FORMAT(t_press.press_start_at, '%H:%i')) > 
           (SELECT MAX(IFNULL(t_dies_status.do_sth_at,'2000-01-01 00:00')) 
            FROM t_dies_status 
            WHERE t_dies_status.dies_id = t_press.dies_id
              AND (t_dies_status.die_status_id = 4 OR t_dies_status.die_status_id = 10)) 
      THEN 1 ELSE 0
  END) AS is_washed_die,
  lds.die_status,
  pl.length_km_after_nitriding,
  wc.washing_count_after_nitriding
FROM t_press
LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
LEFT JOIN latest_die_status lds ON lds.dies_id = t_press.dies_id
LEFT JOIN profile_length_after_nitriding_by_dies_id pl ON pl.dies_id = m_dies.id
LEFT JOIN washing_count_after_nitriding_by_dies_id wc ON wc.dies_id = m_dies.id
WHERE m_dies.id = :dies_id
ORDER BY 
  CASE lds.die_status
      WHEN 'Grinding' THEN 9
      WHEN 'Wire cutting' THEN 8
      WHEN 'NG' THEN 7
      WHEN 'Washing' THEN 6
      WHEN 'OK' THEN 5
      WHEN 'Measuring' THEN 4
      WHEN 'On rack' THEN 3
      ELSE 0
  END DESC,
  is_washed_die DESC,
  dnb ASC
;
";

      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':dies_id', $dies_id, PDO::PARAM_INT);  // bind dies_id là số nguyên
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      echo json_encode(["error" => $e->getMessage()]);
  }
  $dbh = null;
?>
