<?php
  /* 21/03/16作成 */
  $userid = "webuser";
  $passwd = "";
  $targetId = $_POST['targetId'];
  
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

      $prepare = $dbh->prepare("SELECT 
      t_dies_status.id,
      m_dies.die_number,
      m_die_status.die_status,
      SUBSTRING_INDEX(staff_name, ' ', - 1) AS name,
      t_dies_status.note,
      DATE_FORMAT(t_dies_status.do_sth_at,
              '%y-%m-%d %H:%i') AS do_sth_at
  FROM
      t_dies_status
          LEFT JOIN
      m_die_status ON t_dies_status.die_status_id = m_die_status.id
          LEFT JOIN
      m_staff ON t_dies_status.staff_id = m_staff.id
      LEFT JOIN
            m_dies ON t_dies_status.dies_id = m_dies.id
  WHERE
      t_dies_status.dies_id = $targetId 
  UNION SELECT 
      t_press.id,
      m_dies.die_number,
      'Press' AS die_status,
      SUBSTRING_INDEX(staff_name, ' ', - 1) AS name,
      CONCAT(t_press.actual_billet_quantities,
              ' ',
              'billets') AS note,
      CONCAT(DATE_FORMAT(t_press.press_date_at, '%y-%m-%d'),
              ' ',
              DATE_FORMAT(t_press.press_start_at, '%H:%i')) AS do_sth_at
  FROM
      t_press
          LEFT JOIN
      m_staff ON t_press.staff_id = m_staff.id
      LEFT JOIN
            m_dies ON t_press.dies_id = m_dies.id
  WHERE
      t_press.dies_id = $targetId
  ORDER BY do_sth_at DESC;
    ");

      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
