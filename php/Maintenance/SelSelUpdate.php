<?php
  /* 21/03/16作成 */
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

      $prepare = $dbh->prepare("
    SELECT 
        t_maintenance_history.id,
        t_maintenance_history.line_id,
        m_part_position.machine_id,
        t_maintenance_history.part_position_id,
        t_maintenance_history.maintenance_start,
        t_maintenance_history.staff_id,
        t_maintenance_history.normal,
        t_maintenance_history.note
    FROM
        t_maintenance_history
    LEFT JOIN
        m_part_position ON m_part_position.id = t_maintenance_history.part_position_id
    LEFT JOIN
        m_machine ON m_machine.id = m_part_position.machine_id
    WHERE
        t_maintenance_history.id = :targetId
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
