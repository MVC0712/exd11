<?php
  /* 21/04/11作成 */
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
    $prepare = $dbh->prepare("
      SET @billet_9 := 132
    ");
    $prepare->execute();

    // ROUND(((CASE t_press_directive.billet_size WHEN 9 THEN 132 ELSE 0 END) * 1000 / 1200) / m_production_numbers.specific_weight, 1) AS ratio, 


    $prepare = $dbh->prepare("

    SELECT 
    t_press_directive.id,
    m_dies.die_number,
    m_production_numbers.production_number,
    t_press_directive.plan_date_at,
    m_pressing_type.pressing_type,
    ROUND((CASE t_press_directive.billet_size
                WHEN 9 THEN 132 * (t_press_directive.billet_length - t_press_directive.discard_thickness) / t_press_directive.billet_length / m_production_numbers.specific_weight
                ELSE 0
            END),
            1) AS press_length,
    m_production_numbers.production_length,
    CASE m_production_numbers.billet_material_id
        WHEN 1 THEN '6061'
        WHEN 2 THEN '6063'
        WHEN 3 THEN '6N01A'
        ELSE '6N01'
    END AS material,
    ROUND(m_production_numbers.specific_weight, 2) AS specific_weight,
    CASE t_press_directive.billet_size
        WHEN 9 THEN (237 * 237 * 3.1415 / 4) / (m_dies.hole * m_production_numbers.cross_section_area)
        ELSE 0
    END AS ratio,
    m_nbn.nbn,
    t_press_directive.previous_press_note,
    m_staff.staff_name,
    t_press_directive.created_at AS issue_date,
    '999' AS plan_pressing_time,
    t_press_directive.billet_input_quantity,
    t_press_directive.billet_length,
    t_press_directive.discard_thickness,
    t_press_directive.ram_speed,
    ROUND(((CASE t_press_directive.billet_size
                WHEN 9 THEN 132
                ELSE 0
            END) * 1000 / 1200) / m_production_numbers.specific_weight * t_press_directive.ram_speed / 1000 * 60,
            1) AS work_speed2,
    ROUND((CASE t_press_directive.billet_size
                WHEN 9 THEN (237 * 237 * 3.1415 / 4)
                ELSE 0
            END) / (m_dies.hole * m_production_numbers.cross_section_area) * t_press_directive.ram_speed * 60 / 1000,
            1) AS work_speed,
    t_press_directive.billet_temperature,
    t_press_directive.billet_taper_heating,
    t_press_directive.die_temperature,
    t_press_directive.die_heating_time,
    t_press_directive.stretch_ratio,
    CASE m_production_numbers.cooling_type
        WHEN 1 THEN 'Air'
        WHEN 2 THEN 'Water'
        WHEN 3 THEN 'Mist'
    END AS cooling_type,
    t_press_directive.billet_size,
    m_bolster.bolster_name,
    CASE m_production_numbers.aging_type_id
        WHEN 1 THEN 'O'
        WHEN 2 THEN 'T5'
        WHEN 3 THEN 'T6'
    END AS aging,
    'yyy' AS die_ring,
    t_press_directive.value_l,
    t100.max2 AS value_m,
    t100.max1 AS value_n,
    m_dies.hole
FROM
    t_press_directive
        LEFT JOIN
    m_dies ON t_press_directive.dies_id = m_dies.id
        LEFT JOIN
    m_pressing_type ON t_press_directive.pressing_type_id = m_pressing_type.id
        LEFT JOIN
    m_bolster ON m_dies.bolstar_id = m_bolster.id
        LEFT JOIN
    m_staff ON t_press_directive.incharge_person_id = m_staff.id
        LEFT JOIN
    m_nbn ON t_press_directive.nbn_id = m_nbn.id
        LEFT JOIN
    (SELECT 
        dies_id, max1, max2
    FROM
        t_press_work_length_quantity
    LEFT JOIN t_press ON t_press.id = t_press_work_length_quantity.press_id
    LEFT JOIN (SELECT 
        a1.press_id, max1, MAX(b.work_quantity) AS max2
    FROM
        (SELECT 
        press_id, MAX(work_quantity) AS max1
    FROM
        t_press_work_length_quantity AS a
    GROUP BY press_id) a1
    JOIN t_press_work_length_quantity AS b ON b.press_id = a1.press_id
        AND b.work_quantity != a1.max1
    GROUP BY a1.press_id , a1.max1) ttb ON ttb.press_id = t_press_work_length_quantity.press_id
    WHERE
        max1 > 0
    GROUP BY t_press.dies_id) t100 ON t100.dies_id = t_press_directive.dies_id
        LEFT JOIN
    m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
 
      WHERE t_press_directive.id = :targetId
    ");
    $prepare->bindValue(':targetId', (INT)$_POST["targetId"], PDO::PARAM_INT); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
