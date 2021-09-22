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
      (
        SELECT
          IFNULL(
            DATE_FORMAT(MAX(t_nitriding.nitriding_date_at), '%y-%m-%d'),
            ''
          )
        FROM
          t_nitriding
        WHERE
          t_nitriding.dies_id = t_press.dies_id
      ) AS nitriding_date,
      ROUND(
        SUM(
          CASE
            WHEN t_press.press_date_at > (
              SELECT
                MAX(
                  IFNULL(t_nitriding.nitriding_date_at, '2000-01-01')
                ) AS nitriding_date
              FROM
                m_dies
                LEFT JOIN t_nitriding ON t_nitriding.dies_id = m_dies.id
              WHERE
                m_dies.id = t_press.dies_id
              GROUP BY
                m_dies.id
            ) THEN (
              t_press.actual_billet_quantities * t_press.billet_size * t_press.billet_size * 0.0417 * 0.0417 * 3.14 / 4 * t_press.billet_length
            ) / m_production_numbers.specific_weight / m_dies.hole / 1000
            ELSE 0
          END
        ),
        2
      ) AS after_nitriding_length,
      SUM(
        CASE
          WHEN (
            t_press.press_date_at > (
              SELECT
                MAX(
                  IFNULL(t_nitriding.nitriding_date_at, '2000-01-01')
                ) AS nitriding_date
              FROM
                m_dies
                LEFT JOIN t_nitriding ON t_nitriding.dies_id = m_dies.id
              WHERE
                m_dies.id = t_press.dies_id
              GROUP BY
                m_dies.id
            )
          )
          AND (t_press.is_washed_die = 2) THEN 1
          ELSE 0
        END
      ) AS is_washed_die,
      ROUND(
        SUM(
          (
            t_press.actual_billet_quantities * t_press.billet_size * t_press.billet_size * 0.0417 * 0.0417 * 3.14 / 4 * t_press.billet_length
          ) / m_production_numbers.specific_weight / m_dies.hole / 1000
        ),
        2
      ) AS total_work_length,
      SUM(
        CASE
          WHEN t_press.is_washed_die = 2 THEN 1
          ELSE 0
        END
      ) AS total_washed_times,
      COUNT(t_press.dies_id) AS total_pressed_times,
      m_dies_diamater.die_diamater
    FROM
      t_press
      LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
      LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
      LEFT JOIN m_dies_diamater ON m_dies.die_diamater_id = m_dies_diamater.id
    GROUP BY
      t_press.dies_id
    ORDER BY
      after_nitriding_length DESC

      ";

      $prepare = $dbh->prepare($sql);

      // $prepare->bindValue(':id', $_POST["id"], PDO::PARAM_STR);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
