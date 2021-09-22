<?php
  /* 21/09/06 */
  $userid = "webuser";
  $passwd = "";
//   print_r($_POST);
  
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

      $sql = "
        SELECT
                  DATE_FORMAT(t_packing.packing_date, '%Y-%m-%d') AS packing_date,
                  TIME_FORMAT(t_packing.packing_start, '%H:%i') AS packing_start,
                  TIME_FORMAT(t_packing.packing_end, '%H:%i') AS packing_end
        FROM
          t_packing
        WHERE t_packing.id = :t_packing_id
       ";
      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':t_packing_id', (INT)$_POST["t_packing_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetch(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
