<?php
  $userid = "webuser";
  $passwd = "";

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
    $prepare = $dbh->prepare("SELECT 
    t_press_plan.id,
    plan_date AS press_date_at,
    quantity AS actual_billet_quantities,
    m_production_numbers.etcing_file_url,
    t10.n,
    t10.m,
    t10.die_number,
    t10.hole
FROM
    extrusion.t_press_plan
        LEFT JOIN
    m_dies ON m_dies.id = t_press_plan.dies_id
        LEFT JOIN
    m_production_numbers ON m_production_numbers.id = m_dies.production_number_id
        LEFT JOIN
    (SELECT 
        nbn_id,
            LEFT(nbn, 1) AS n,
            RIGHT(nbn, 1) AS m,
            nbn,
            dies_id,
            die_number,
            hole
    FROM
        t_press_directive
    LEFT JOIN m_dies ON m_dies.id = t_press_directive.dies_id
    LEFT JOIN m_nbn ON m_nbn.id = t_press_directive.nbn_id
    GROUP BY dies_id) t10 ON t10.dies_id = t_press_plan.dies_id
WHERE
    t_press_plan.id  = :id
    ");
    $prepare->bindValue(':id', (INT)$_POST["id"], PDO::PARAM_INT);
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
