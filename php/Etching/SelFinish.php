<?php
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

      $prepare = $dbh->prepare("
    SELECT 
    IFNULL(etching_finish, 0) AS etching_finish,
    IFNULL(etching_staff, 0) AS etching_staff,
    IFNULL(etching_check_staff, 0) AS etching_check_staff,
    IFNULL(etching_file_url, 'No_image.jpg') AS etching_file_url,
    IFNULL(etching_image_url, 'No_image.jpg') AS etching_image_url
    FROM
      t_press_sub
    WHERE
      press_id = $press_id ;
      ");

      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
