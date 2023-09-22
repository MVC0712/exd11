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
      t10.start_time,
      t10.end_time,
      t_plc_web.die_name,
      t10.billet_quantity,
      t_plc_web.machine,
      tempdieup,
      tempdiedown,
      tempstemup,
      tempstemdown
  FROM
      t_plc_web
          LEFT JOIN
      t_plc_web_log ON t_plc_web_log.date_time = t_plc_web.end_time
          LEFT JOIN
      (SELECT 
          start_time,
              MAX(end_time) AS end_time,
              MAX(billet_quantity) AS billet_quantity
      FROM
          t_plc_web
      GROUP BY t_plc_web.start_time) AS t10 ON t10.start_time = t_plc_web.start_time
  WHERE
      t_plc_web.die_name LIKE :die_number $add
  GROUP BY t_plc_web.start_time , machine
  ORDER BY end_time DESC;
      ";

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
