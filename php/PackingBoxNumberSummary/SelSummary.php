<?php
  /* 21/09/29 */
  $userid = "webuser";
  $passwd = "";
  
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
	t_packing_box_number.box_number,
	m_dies.die_number,
	LEFT(t_press.billet_lot_number, 25) AS billet_lot_number,
	SUM(t_packing_box.work_quantity) AS total_quantity,
	DATE_FORMAT(t_press.press_date_at, '%y-%m-%d') AS press_date_at,
	DATE_FORMAT(t_aging.aging_date, '%y-%m-%d') AS aging_date,
	DATE_FORMAT(t_packing.packing_date, '%y-%m-%d') AS packing_date
FROM t_packing_box
LEFT JOIN t_packing_box_number ON t_packing_box.box_number_id = t_packing_box_number.id
LEFT JOIN t_packing ON t_packing_box.packing_id = t_packing.id
LEFT JOIN t_using_aging_rack ON t_packing_box.using_aging_rack_id = t_using_aging_rack.id
LEFT JOIN t_aging ON t_using_aging_rack.aging_id = t_aging.id
LEFT JOIN t_press ON t_using_aging_rack.t_press_id = t_press.id
LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
GROUP BY 
	t_packing_box_number.box_number,
	m_production_numbers.production_number,
	m_dies.die_number,
	t_press.press_date_at,
	t_aging.aging_date,
	t_packing.packing_date
ORDER BY t_packing_box_number.box_number DESC, t_press.press_date_at DESC

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
