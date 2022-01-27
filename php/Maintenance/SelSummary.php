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
            t_maintenance_history.id AS id,
            machine_id,
            machine,
            part_position_id,
            part_position,
            DATE_FORMAT(maintenance_start, '%y-%m-%d %H:%i') AS maintenance_start,
            DATE_FORMAT(maintenance_finish, '%y-%m-%d %H:%i') AS maintenance_finish,
            note,
            file_url,
            DATEDIFF(CURRENT_DATE, maintenance_finish) AS TTN,
            CASE
            WHEN duration > DATEDIFF(CURRENT_DATE, maintenance_finish) THEN 'NY'
            WHEN duration <= DATEDIFF(CURRENT_DATE, maintenance_finish) THEN 'IT'
            END AS Ittime,
            (TIME_FORMAT(TIMEDIFF(maintenance_finish, maintenance_start),
            '%H') - DATEDIFF(maintenance_finish, maintenance_start) * 16) AS Totaltime
        FROM
            t_maintenance_history
        LEFT JOIN
            m_part_position ON m_part_position.id = t_maintenance_history.part_position_id
        LEFT JOIN
            m_machine ON m_part_position.machine_id = m_machine.id
        GROUP BY m_part_position.id
        ORDER BY maintenance_start DESC;
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
