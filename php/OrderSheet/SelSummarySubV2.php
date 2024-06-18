<?php
  /* 24-06-14 update */
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

with subT1 as (
SELECT 
    t_press.ordersheet_id as ordersheet_id,
    SUM(IFNULL(t1.sum_cut_qty, 0) - IFNULL(t2.sum_ng_qty, 0)) AS sum_ok_qty,
    SUM(IFNULL(t1.sum_cut_qty, 0)) AS sum_cut_qty
FROM
    t_press
        LEFT JOIN
    (SELECT 
        t_using_aging_rack.t_press_id,
            SUM(IFNULL(t_using_aging_rack.work_quantity, 0)) AS sum_cut_qty
    FROM
        t_using_aging_rack
    WHERE
        t_using_aging_rack.t_press_id IS NOT NULL
    GROUP BY t_using_aging_rack.t_press_id) AS t1 ON t1.t_press_id = t_press.id
        LEFT JOIN
    (SELECT 
        t_using_aging_rack.t_press_id,
            SUM(IFNULL(t_press_quality.ng_quantities, 0)) AS sum_ng_qty
    FROM
        t_using_aging_rack
    LEFT JOIN t_press_quality ON t_press_quality.using_aging_rack_id = t_using_aging_rack.id
    WHERE
        t_using_aging_rack.t_press_id IS NOT NULL
    GROUP BY t_using_aging_rack.t_press_id) AS t2 ON t2.t_press_id = t_press.id
where t_press.ordersheet_id is not null
group by t_press.ordersheet_id 
),
subT2 as (
SELECT 
    t_packing.m_ordersheet_id as ordersheet_id,
    sum(t_packing_box.work_quantity) as sum_packed_qty
FROM
    t_packing
        LEFT JOIN
    t_packing_box ON t_packing_box.packing_id = t_packing.id
group by t_packing.m_ordersheet_id
)
select 
	m_ordersheet.id,
    m_ordersheet.ordersheet_number,
    date_format(m_ordersheet.delivery_date_at, '%y-%m-%d') as delivery_date_at,
    date_format(m_ordersheet.issue_date_at, '%y-%m-%d') as issue_date_at,
    m_production_numbers.production_number,
    m_ordersheet.production_quantity,
    ifnull(subT1.sum_ok_qty, 0) as sum_ok_qty,
    ifnull(subT2.sum_packed_qty, 0) as sum_packed_qty
from 
	m_ordersheet
left join subT1 on subT1.ordersheet_id = m_ordersheet.id
left join subT2 on subT2.ordersheet_id = m_ordersheet.id
left join m_production_numbers on m_ordersheet.production_numbers_id = m_production_numbers.id
WHERE m_ordersheet.delivery_date_at >= date_sub(curdate(), interval 1 year)
order by m_ordersheet.id desc
        ;
    ");
    $prepare->execute();
    $result = $prepare->fetchALL(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
