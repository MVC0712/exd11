<?php
  /* 21/09/02作成 */
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
            't_packing_box_id',
            t_packing_box_number.box_number,
            SUM(t_packing_box.work_quantity) AS work_quantity
          FROM t_packing
          LEFT JOIN t_packing_box ON t_packing_box.packing_id = t_packing.id
          LEFT JOIN t_packing_box_number ON t_packing_box.box_number_id = t_packing_box_number.id
          WHERE t_packing.id = :t_packing_id
          GROUP BY t_packing_box_number.box_number
       ";
      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':t_packing_id', (INT)$_POST["t_packing_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
