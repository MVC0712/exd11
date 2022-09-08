<?php
  /* 21/06/22作成 */
  $userid = "webuser";
  $passwd = "";
  $production_number = "";

  $production_number = $_POST['production_number'];
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
      t_press.dies_id AS did,
      m_dies.die_number AS dnb,
      SUM(CASE
          WHEN
              (CONCAT(t_press.press_date_at,
                      ' ',
                      DATE_FORMAT(t_press.press_start_at, '%H:%i')) > (SELECT 
                      MAX(IFNULL(t_dies_status.do_sth_at,
                                  '2000-01-01 00:00')) AS do_sth_date
                  FROM
                      m_dies
                          LEFT JOIN
                      t_dies_status ON t_dies_status.dies_id = m_dies.id
                  WHERE
                      m_dies.id = t_press.dies_id
                          AND (t_dies_status.die_status_id = 4
                          OR t_dies_status.die_status_id = 10)
                  GROUP BY m_dies.id))
          THEN
              1
          ELSE 0
      END) AS is_washed_die,
      t10.die_status
  FROM
      t_press
          LEFT JOIN
      m_dies ON t_press.dies_id = m_dies.id
          LEFT JOIN
      (SELECT 
          t_dies_status.dies_id,
              m_die_status.die_status,
              t_dies_status.die_status_id,
              t_dies_status.do_sth_at,
              t_dies_status.note
      FROM
          t_dies_status
      LEFT JOIN m_die_status ON t_dies_status.die_status_id = m_die_status.id
      LEFT JOIN (SELECT 
          t_dies_status.dies_id,
              t_dies_status.die_status_id,
              MAX(t_dies_status.do_sth_at) AS do_sth_at
      FROM
          t_dies_status
      GROUP BY t_dies_status.dies_id) AS t10 ON t_dies_status.dies_id = t10.dies_id
          AND t_dies_status.do_sth_at = t10.do_sth_at
      WHERE
          t10.dies_id IS NOT NULL) AS t10 ON t10.dies_id = t_press.dies_id
          LEFT JOIN
      m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
  WHERE
      m_production_numbers.id = $production_number
  GROUP BY did
  ORDER BY CASE die_status
      WHEN 'Grinding' THEN 9
      WHEN 'Wire cutting' THEN 8
      WHEN 'NG' THEN 7
      WHEN 'Washing' THEN 6
      WHEN 'OK' THEN 5
      WHEN 'Measuring' THEN 4
      WHEN 'On rack' THEN 3
      ELSE 0
  END DESC , is_washed_die DESC , die_number ASC;";

      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
