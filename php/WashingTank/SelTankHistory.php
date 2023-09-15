<?php
  /* 21/03/16作成 */
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

      $prepare = $dbh->prepare("SELECT 
        t_washing_tank.id,
        CONCAT('Tank ', wasshing_tank) AS tank,
        DATE_FORMAT(wasshing_tank_change_at,
                '%y-%m-%d %H:%i') AS wasshing_tank_change_at,
        SUBSTRING_INDEX(staff_name, ' ', - 1) AS staff_name,
        CONCAT(naoh_weight, 'Kg') AS naoh_weight,
        CONCAT(gluconat_weight, 'Kg') AS gluconat_weight,
        '' AS glass_weight,
        quantity
    FROM
        t_washing_tank
            LEFT JOIN
        m_staff ON m_staff.id = t_washing_tank.change_staff 
    UNION SELECT 
        t_washing_shot.id,
        CONCAT('Shot ', wasshing_shot) AS tank,
        DATE_FORMAT(wasshing_shot_change_at,
                '%y-%m-%d %H:%i') AS wasshing_tank_change_at,
        SUBSTRING_INDEX(staff_name, ' ', - 1) AS staff_name,
        '' AS naoh_weight,
        '' AS gluconat_weight,
        CONCAT(glass_weight, 'Kg') AS glass_weight,
        quantity
    FROM
        t_washing_shot
            LEFT JOIN
        m_staff ON m_staff.id = t_washing_shot.change_shot_staff
        ORDER BY wasshing_tank_change_at DESC
    ");
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
