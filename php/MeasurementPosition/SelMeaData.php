<?php
  /* 21/08/01作成 */
  $userid = "webuser";
  $passwd = "";
  $press_id = $_POST['press_id'];
  
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
      position, value, t_measurement_position.id
    FROM
      extrusion.t_measurement_position
    LEFT JOIN
      t_press ON t_press.id = t_measurement_position.press_id
      WHERE press_id = '$press_id'
    ORDER BY position ASC , measurement_position_id ASC;
      ");

      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
