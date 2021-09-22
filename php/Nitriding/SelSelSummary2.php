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
      
      (
        SELECT 
          t10.id,
          t20.die_number,
          t10.nitriding_date,
          ROUND(SUM(t20.ex_length), 2) AS ex_length
        FROM 
          (
          SELECT 
            T3.id,
            T3.dies_id,
            T4.nitriding_date_at AS last_nitriding_date,
            DATE_FORMAT(T3.nitriding_date_at, '%y-%m-%d') AS nitriding_date
          FROM 
            (
              SELECT 
                T1.id,
                T1.dies_id,
                T1.nitriding_date_at,
                (
                  SELECT 
                    COUNT(T2.nitriding_date_at)
                  FROM t_nitriding T2
                  WHERE T2.nitriding_date_at > T1.nitriding_date_at AND T2.dies_id = 2
                ) + 1 AS rank_1
              FROM t_nitriding T1
              WHERE T1.dies_id = :id_1
            ) T3, (
              SELECT 
                T1.dies_id,
                T1.nitriding_date_at,
                (
                  SELECT 
                    COUNT(T2.nitriding_date_at)
                  FROM t_nitriding T2
                  WHERE T2.nitriding_date_at > T1.nitriding_date_at AND T2.dies_id = 2
                ) + 1 AS rank_1
              FROM t_nitriding T1
              WHERE T1.dies_id = :id_2
            ) T4
          WHERE T3.rank_1 = T4.rank_1 - 1
        ) t10 CROSS JOIN (
        SELECT 
            t_press.press_date_at,
            m_dies.die_number,
              ROUND((CASE billet_size 
                WHEN 9  THEN (132.3 * billet_length / 1200) * actual_billet_quantities 
                WHEN 12 THEN (236.7 * billet_length / 1200) * actual_billet_quantities 
                ELSE 0 END) / m_production_numbers.specific_weight / 1000, 4)   AS ex_length		
        FROM t_press
        LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
        LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
        WHERE t_press.dies_id = :id_3
        ) t20
        WHERE t20.press_date_at BETWEEN last_nitriding_date AND nitriding_date
        GROUP BY t10.dies_id, t10.nitriding_date
        ORDER BY t10.nitriding_date DESC 
        ) UNION (
        
        SELECT 
          t_nitriding.id,
          m_dies.die_number,
          DATE_FORMAT(t_nitriding.nitriding_date_at, '%y-%m-%d') AS nitriding_date,
          '' AS ex_length
        FROM t_nitriding
        LEFT JOIN m_dies ON  t_nitriding.dies_id = m_dies.id
        WHERE t_nitriding.id = (
            SELECT 
              t_nitriding.id
            FROM t_nitriding
            WHERE t_nitriding.dies_id = :id_4
            ORDER BY t_nitriding.nitriding_date_at
            LIMIT 1
          )
        
        ) 
        ORDER BY nitriding_date DESC
        ;
    

      ";

      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':id_1', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->bindValue(':id_2', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->bindValue(':id_3', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->bindValue(':id_4', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
