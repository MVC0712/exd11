<?php
  /* 21/08/24作成 */
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
        	t_using_aging_rack.id,
          t_using_aging_rack.rack_number,
          t_using_aging_rack.order_number,
          t_using_aging_rack.work_quantity - IFNULL(
          (
            SELECT 
              SUM(t_press_quality.ng_quantities)
            FROM t_press_quality
            WHERE t_press_quality.using_aging_rack_id = t_using_aging_rack.id 
          ), 0) AS ok_qty,
          (
            SELECT
              IFNULL(SUM(t_packing_box.work_quantity), 0) AS packed_work
            FROM t_packing_box
            WHERE t_packing_box.using_aging_rack_id = t_using_aging_rack.id
          ) AS packed_work_qty
        FROM t_using_aging_rack
        WHERE t_using_aging_rack.t_press_id = :t_press_id
        ORDER BY t_using_aging_rack.order_number
      ";

      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':t_press_id', (INT)$_POST["t_press_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
