<?php
  /* 21/03/16作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  
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

      $prepare = $dbh->prepare("
        SELECT 
        t_maintenance_history.id,
        m_machine.machine,
        m_part_position.part_position,
        DATE_FORMAT(t_maintenance_history.maintenance_start,
                '%y-%m-%d %H:%i') AS maintenance_start,
        DATE_FORMAT(t_maintenance_history.maintenance_finish,
                '%y-%m-%d %H:%i') AS maintenance_finish,
        t_maintenance_history.note
    FROM
        t_maintenance_history
            LEFT JOIN
        m_part_position ON t_maintenance_history.part_position_id = m_part_position.id
            LEFT JOIN
        m_machine ON m_part_position.machine_id = m_machine.id
    WHERE
        t_maintenance_history.part_position_id = :targetId
    ORDER BY maintenance_finish DESC;
    ");

      $prepare->bindValue(':targetId', $_POST["targetId"], (INT)PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
