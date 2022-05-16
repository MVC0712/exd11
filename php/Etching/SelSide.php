<?php
  $userid = "webuser";
  $passwd = "";
  
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
        nbn_id,
        LEFT(nbn, 1) AS n,
        RIGHT(nbn, 1) AS m,
        nbn,
        dies_id,
        die_number,
        hole
      FROM
        t_press_directive
      LEFT JOIN
        m_dies ON m_dies.id = t_press_directive.dies_id
      LEFT JOIN
        m_nbn ON m_nbn.id = t_press_directive.nbn_id
      WHERE
        dies_id = :dies_id
      ORDER BY plan_date_at DESC;
      ");

      $prepare->bindValue(':dies_id', (INT)$_POST["dies_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
