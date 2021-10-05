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
            t_dies_status.id,
            m_dies.die_number,
            m_die_status.die_status,
            t_dies_status.note,
            DATE_FORMAT(t_dies_status.do_sth_at, '%y-%m-%d %H-%i') AS do_sth_at
        FROM
            t_dies_status
        LEFT JOIN
            m_dies ON t_dies_status.dies_id = m_dies.id
        LEFT JOIN
            m_die_status ON t_dies_status.die_status_id = m_die_status.id
        WHERE
            t_dies_status.dies_id = :targetId
        ORDER BY do_sth_at DESC
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
