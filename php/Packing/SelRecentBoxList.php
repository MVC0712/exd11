<?php
  /* 21/08/31作成 */
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
          'dummy',
          DATE_FORMAT(MAX(t_packing.packing_date), '%m-%d') AS packing_date,
          t_packing_box_number.box_number,
          SUM(t_packing_box.work_quantity) AS work_quantity
        FROM t_packing_box
        LEFT JOIN t_packing_box_number ON t_packing_box.box_number_id = t_packing_box_number.id
        LEFT JOIN t_packing ON t_packing_box.packing_id = t_packing.id
        GROUP BY 	t_packing_box_number.box_number
        ORDER BY t_packing.packing_date DESC, t_packing_box_number.box_number
        LIMIT 50
       ";
      $prepare = $dbh->prepare($sql);

      // $prepare->bindValue(':m_ordersheet_id', (INT)$_POST["m_ordersheet_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
