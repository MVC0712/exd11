<?php
  /* 21/09/07 */
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
	t_packing_box_number.id AS t_packing_box_number_id,
	t10.m_ordersheet_id,
	t_packing_box_number.box_number,
	IFNULL((
		SELECT SUM(t_packing_box.work_quantity)
		FROM t_packing_box
		WHERE t_packing_box.box_number_id = t_packing_box_number.id
	), 0) AS total_quantity
FROM t_packing_box_number
LEFT JOIN 
	(
		SELECT 
			t_packing_box.box_number_id,
			m_ordersheet.id AS m_ordersheet_id,
			m_ordersheet.ordersheet_number
		FROM t_packing_box
		LEFT JOIN t_packing_box_number ON t_packing_box.box_number_id
		LEFT JOIN t_using_aging_rack ON t_packing_box.using_aging_rack_id = t_using_aging_rack.id
		LEFT JOIN t_press ON t_using_aging_rack.t_press_id = t_press.id
		LEFT JOIN m_ordersheet ON t_press.ordersheet_id = m_ordersheet.id	
	) AS t10 ON t10.box_number_id = t_packing_box_number.id
WHERE t10.m_ordersheet_id = :m_ordersheet_id
GROUP BY t_packing_box_number_id

       ";
      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':m_ordersheet_id', (INT)$_POST["m_ordersheet_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
