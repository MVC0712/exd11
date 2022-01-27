<?php
  $userid = "webuser";
  $passwd = "";
  
  try {
      $dbh = new PDO(
          'mysql:host=localhost; dbname=exd_maintenance; charset=utf8',
          $userid,
          $passwd,
          array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
      )
      );

      $sql = "
        SELECT 
        t_maintenance_history.id,
        m_part_position.machine_id,
        m_machine.machine,
        t_maintenance_history.part_position_id,
        m_part_position.part_position,
        DATE_FORMAT(t10.maintenance_start, '%y-%m-%d %H:%i') AS maintenance_start,
        DATE_FORMAT(t10.maintenance_finish, '%y-%m-%d %H:%i') AS maintenance_finish,
        t_maintenance_history.note,
        t_maintenance_history.file_url,
        DATEDIFF(CURRENT_DATE, t10.maintenance_finish) AS TTN,
        CASE
            WHEN
                m_part_position.duration > DATEDIFF(CURRENT_DATE,
                        t_maintenance_history.maintenance_finish)
            THEN
                'NY'
            WHEN m_part_position.duration <= DATEDIFF(CURRENT_DATE, t10.maintenance_finish) THEN 'IT'
        END AS Ittime,
        (TIME_FORMAT(TIMEDIFF(t10.maintenance_finish,
                        t10.maintenance_start),
                '%H') - DATEDIFF(t10.maintenance_finish,
                t10.maintenance_start) * 16) AS Totaltime
    FROM
        t_maintenance_history
            LEFT JOIN
        m_part_position ON t_maintenance_history.part_position_id = m_part_position.id
            LEFT JOIN
        m_machine ON m_part_position.machine_id = m_machine.id
            LEFT JOIN
        (SELECT 
            t_maintenance_history.part_position_id,
                MAX(t_maintenance_history.maintenance_start) AS maintenance_start,
                MAX(t_maintenance_history.maintenance_finish) AS maintenance_finish
        FROM
            t_maintenance_history
        GROUP BY t_maintenance_history.part_position_id) AS t10 ON t_maintenance_history.part_position_id = t10.part_position_id
            AND t_maintenance_history.maintenance_finish = t10.maintenance_finish
    WHERE
        t10.part_position_id IS NOT NULL
    GROUP BY t_maintenance_history.part_position_id
    ORDER BY Ittime ASC , m_machine.machine ASC , t10.maintenance_finish DESC;
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
