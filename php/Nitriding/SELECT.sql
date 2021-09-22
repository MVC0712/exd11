SELECT 
          m_dies.id,
          m_dies.die_number,
          IFNULL(nitriding_date_at, '') AS nitriding_date_at,
          IFNULL(t10.after_nitriding_length, 0) AS after_nitriding_length,
          t20.total_length,
          t20.press_times,
          m_dies_diamater.die_diamater
        FROM m_dies
        LEFT JOIN m_dies_diamater ON m_dies.die_diamater_id = m_dies_diamater.id
        LEFT JOIN 
          (
            SELECT 
              t_press.dies_id,
              ROUND(SUM((CASE 
                  WHEN (billet_size =  9 AND t1.nitriding_date_at < t_press.press_date_at) OR t1.dies_id IS NULL
                    THEN (132.3 * billet_length / 1200) * actual_billet_quantities 
                  WHEN (billet_size = 12 AND t1.nitriding_date_at < t_press.press_date_at) OR t1.dies_id IS NULL
                    THEN (236.7 * billet_length / 1200) * actual_billet_quantities 
                  ELSE 0 END) / m_production_numbers.specific_weight / 1000), 2) AS after_nitriding_length,
              DATE_FORMAT(t1.nitriding_date_at, '%y-%m-%d') AS nitriding_date_at
            FROM t_press
            LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
            LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
            LEFT JOIN (
                SELECT 
                  t_nitriding.dies_id,
                  MAX(t_nitriding.nitriding_date_at) AS nitriding_date_at
                FROM t_nitriding
                GROUP BY t_nitriding.dies_id	
              ) t1 ON t_press.dies_id = t1.dies_id	
            #WHERE t_press.dies_id = 2
            GROUP BY t_press.dies_id
          ) t10 ON t10.dies_id = m_dies.id
        LEFT JOIN 
          (
            SELECT 
              m_dies.id AS dies_id,
              m_dies.die_number,
              ROUND(SUM((CASE 
                WHEN billet_size =  9 THEN (132.3 * billet_length / 1200) * actual_billet_quantities 
                WHEN billet_size = 12 THEN (236.7 * billet_length / 1200) * actual_billet_quantities 
                ELSE 0 END) / m_production_numbers.specific_weight / 1000), 2) AS total_length,
              COUNT(t_press.id) AS press_times
            
            FROM m_dies 
            LEFT JOIN t_press ON t_press.dies_id = m_dies.id
            LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
            GROUP BY 
              m_dies.id,
              m_dies.die_number
          ) t20 ON t20.dies_id = m_dies.id
          ORDER BY after_nitriding_length DESC