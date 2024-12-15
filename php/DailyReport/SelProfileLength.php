<?php
  /* 21/08/15作成 */
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
            t_press_work_length_quantity.billet_number,
            IFNULL(ROUND(SUM(CASE WHEN t_press_work_length_quantity.work_number = 1 THEN t_press_work_length_quantity.work_length ELSE NULL END), 1), '') AS work1_len,
            IFNULL(ROUND(SUM(CASE WHEN t_press_work_length_quantity.work_number = 1 THEN t_press_work_length_quantity.work_quantity ELSE NULL END), 0), '') AS work1_qty
          FROM t_press_work_length_quantity
          WHERE t_press_work_length_quantity.press_id = :id
          GROUP BY 	t_press_work_length_quantity.billet_number
    ");

      $prepare->bindValue(':id', $_POST["id"], PDO::PARAM_STR);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
