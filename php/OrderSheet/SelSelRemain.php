<?php
  /* 21/09/28作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  
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

    $sql = "
      SELECT 
        DATE_FORMAT(t_press.press_date_at, '%y-%m-%d'),
        SUM(t_using_aging_rack.work_quantity) AS total_work_quantity
      FROM t_using_aging_rack
      LEFT JOIN t_packing_box ON t_packing_box.using_aging_rack_id = t_using_aging_rack.id
      LEFT JOIN t_press ON t_using_aging_rack.t_press_id = t_press.id
      LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
      LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
      WHERE
        t_packing_box.id IS NULL 
        AND 
        (t_using_aging_rack.work_quantity IS NOT NULL AND t_using_aging_rack.work_quantity != 0)
        AND m_production_numbers.production_number = :production_number
      GROUP BY t_using_aging_rack.t_press_id
      ORDER BY t_press.press_date_at DESC    
    ";


    $prepare = $dbh->prepare($sql);

    $prepare->bindValue(':production_number', $_POST["production_number"], (INT)PDO::PARAM_INT); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
