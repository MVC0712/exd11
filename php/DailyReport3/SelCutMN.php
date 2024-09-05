<?php
  $userid = "webuser";
  $passwd = "";

  $dies_id = $_POST['dies_id'];

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
            t_press_directive.id,
            CONCAT(value_m, '~', value_n) AS mn,
            dies_id,
            plan_date_at
        FROM
            extrusion.t_press_directive
        WHERE
            dies_id = $dies_id
        ORDER BY plan_date_at DESC
        LIMIT 1;
    ");

      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
