<?php
  /* 21/07/19作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  $machine = $_POST['machine'];
  if ($machine == 0) {
    $add = "";
  } else {
    $add = " AND t_plc_web.machine = '$machine'";
  };
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

      $sql = "SELECT 
      start_time,
      MAX(end_time) AS end_time,
      t_plc_web.die_name,
      MAX(t_plc_web.billet_quantity),
      t_plc_web.machine,
      MAX(tempdieup),
      MAX(tempdiedown),
      MAX(tempstemup),
      MAX(tempstemdown)
  FROM
      t_plc_web
          LEFT JOIN
      (SELECT 
          die_name,
              MAX(date_time) AS date_time,
              tempdieup,
              tempdiedown,
              tempstemup,
              tempstemdown,
              t_plc_web_log.machine,
              billet_counter
      FROM
          t_plc_web_log
      GROUP BY billet_counter , DATE_FORMAT(date_time, '%y-%m-%d') , machine
      ORDER BY date_time DESC
      LIMIT 2000) t10 ON t_plc_web.end_time = t10.date_time
  WHERE
      t_plc_web.die_name LIKE :die_number $add
      GROUP BY start_time
        ORDER BY end_time DESC;";

      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':die_number', $_POST["die_number"], PDO::PARAM_STR);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
