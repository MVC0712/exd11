<?php
  /* 7th May 2023 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  // print_r($_POST["berfore3Month"]);
  
  try{
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
        t_press_plan.plan_date,
        m_dies.die_number,
        m_pressing_type.pressing_type,
        t_press_plan.quantity,
        t10.billet_length,
        t10.billet_input_quantity,
        t10.ram_speed
      FROM t_press_plan
      LEFT JOIN m_dies ON t_press_plan.dies_id = m_dies.id
      LEFT JOIN m_pressing_type ON t_press_plan.pressing_type_id = m_pressing_type.id
      LEFT JOIN 
      	(
					SELECT 
						t_press_directive.id AS press_directive_id,
						t_press_directive.dies_id,
						t_press_directive.billet_length,
						ifnull(t_press_directive.billet_input_quantity, 0) AS billet_input_quantity,
						t_press_directive.ram_speed,
						t_press_directive.plan_date_at
					FROM t_press_directive
					WHERE (t_press_directive.dies_id, t_press_directive.plan_date_at) 
						IN 
							(
								SELECT 
								#	t_press_directive.id,
									t_press_directive.dies_id,
									MAX(t_press_directive.plan_date_at)
								FROM t_press_directive
								GROUP BY t_press_directive.dies_id		
							)     	
				) as t10 ON t_press_plan.dies_id = t10.dies_id
      WHERE t_press_plan.plan_date BETWEEN :before3Month AND :after3Month
      ");
      // WHERE t_press_plan.plan_date BETWEEN '2023-2-1' AND '2023-2-28'
      // WHERE m_production_numbers_category1.id != 0

    $prepare->bindValue(':before3Month', $_POST["before3Month"], PDO::PARAM_STR);
    $prepare->bindValue(':after3Month', $_POST["after3Month"], PDO::PARAM_STR);


    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
