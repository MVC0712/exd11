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
  t10.id,
  t10.dies_id,
  t10.rank,
  m_dies.die_number,
  t10.nitriding_date_at AS term_1,
  (
    SELECT
      IFNULL(
        ROUND(
          SUM(
            (
              (t_press.billet_size * t_press.billet_size) * (0.0417 * 0.0417) / 4 * 3.1415 * t_press.billet_length * t_press.actual_billet_quantities
            ) / m_production_numbers.specific_weight
          ) / 1000,
          2
        ),
        0
      ) AS profile_length
    from
      t_press
      left join m_dies on t_press.dies_id = m_dies.id
      left join m_production_numbers on m_dies.production_number_id = m_production_numbers.id
    where
      t_press.dies_id = :id_1
      and t_press.press_date_at between t20.nitriding_date_at
      and t10.nitriding_date_at
  ) as profile_length,
  (
    select
      sum(
        case
          when t_press.is_washed_die = 2 then 1
          else 0
        end
      ) as washing_time
    from
      t_press
    where
      t_press.dies_id = :id_2
  ) as washing_time
FROM
  (
    SELECT
      T1.id,
      T1.dies_id,
      T1.nitriding_date_at,
      (
        SELECT
          COUNT(T2.nitriding_date_at)
        FROM
          t_nitriding T2
        WHERE
          T2.nitriding_date_at < T1.nitriding_date_at
          AND T2.dies_id = :id_3
      ) + 1 AS rank
    FROM
      t_nitriding T1
    WHERE
      T1.dies_id = :id_4
    UNION
    SELECT
      0,
      :id_5,
      STR_TO_DATE('2021-01-01', '%Y-%m-%d'),
      0
  ) t10
  INNER JOIN (
    SELECT
      T1.id,
      T1.dies_id,
      T1.nitriding_date_at,
      (
        SELECT
          COUNT(T2.nitriding_date_at)
        FROM
          t_nitriding T2
        WHERE
          T2.nitriding_date_at < T1.nitriding_date_at
          AND T2.dies_id = :id_6
      ) + 1 AS rank
    FROM
      t_nitriding T1
    WHERE
      T1.dies_id = :id_7
    UNION
    SELECT
      0,
      :id_8,
      STR_TO_DATE('2021-01-01', '%Y-%m-%d'),
      0
  ) t20
  LEFT JOIN m_dies ON t10.dies_id = m_dies.id
WHERE
  t10.rank = t20.rank + 1
ORDER BY
  rank DESC

      ";

      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':id_1', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->bindValue(':id_2', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->bindValue(':id_3', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->bindValue(':id_4', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->bindValue(':id_5', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->bindValue(':id_6', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->bindValue(':id_7', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->bindValue(':id_8', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
