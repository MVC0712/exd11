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
      t_press.dies_id,
      m_dies.die_number,
      SUM(CASE
          WHEN
              (t_press.press_date_at > (SELECT 
                      MAX(IFNULL(t_dies_status.do_sth_at, '2000-01-01')) AS do_sth_date
                  FROM
                      m_dies
                          LEFT JOIN
                      t_dies_status ON t_dies_status.dies_id = m_dies.id
                  WHERE
                      m_dies.id = t_press.dies_id
                          AND (t_dies_status.die_status_id = 4
                          OR t_dies_status.die_status_id = 7
                          OR t_dies_status.die_status_id = 8
                          OR t_dies_status.die_status_id = 10)
                  GROUP BY m_dies.id))
          THEN
              1
          ELSE 0
      END) AS is_washed_die,
      t10.die_status,
      t10.die_status_id,
      t10.note,
      DATE_FORMAT(t10.do_sth_at, '%m-%d %H:%i') AS do_sth_at,
      CASE
          WHEN die_status_id = 7 OR die_status_id = 8 THEN 'Fixing'
          WHEN die_status_id = 4 THEN 'Washing'
          WHEN die_status_id = 5 OR die_status_id = 6 THEN 'Cleaning'
          WHEN die_status_id = 1 THEN 'Wait result'
          WHEN
              (die_status_id = 2 AND is_washed_die <= 1)
                  OR die_status_id = 10
                  OR die_status_id = 2
          THEN
              'Ready press'
          WHEN (is_washed_die >= 2 OR die_status_id = 3) THEN 'Need wash'
          ELSE 0
      END AS Act
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
  GROUP BY dies_id
  ORDER BY CASE Act
      WHEN 'Fixing' THEN 9
      WHEN 'Washing' THEN 8
      WHEN 'Cleaning' THEN 7
      WHEN 'Need wash' THEN 6
      WHEN 'Wait result' THEN 5
      WHEN 'Ready press' THEN 4
      ELSE 0
  END DESC , CASE die_status
      WHEN 'Grinding' THEN 9
      WHEN 'Wire cutting' THEN 8
      WHEN 'Washing' THEN 7
      WHEN 'Measuring' THEN 6
      WHEN 'NG' THEN 5
      WHEN 'OK' THEN 4
      WHEN 'Pressed' THEN 3
      ELSE 0
  END DESC , is_washed_die DESC , die_number ASC;
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
