<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}

$start_term = $_POST['start_term'];
$end_term = $_POST['end_term'];
$search = $_POST['search'];

try {
    $sql = "SELECT 
    '' AS ordersheet_number,
    '' AS delivery_date_at,
    '' AS issue_date_at,
    '' AS production_number,
    '' AS die_number,
    ROUND(AVG(m_ordersheet.production_quantity), 0) AS avg_production_quantity,
    ROUND(AVG(t10.work_quantity), 0) AS avg_work_quantity,
    ROUND(AVG(t10.total_ng), 0) AS avg_total_ng,
    ROUND(AVG(t10.work_quantity - t10.total_ng), 0) AS avg_total_ok,
    CONCAT(ROUND(AVG((t10.work_quantity - t10.total_ng) / m_ordersheet.production_quantity * 100), 0), '%') AS avg_ok_order,
    ROUND(AVG(t20.packed_work_quantitiy), 0) AS avg_packed,
    CONCAT(ROUND(AVG(t20.packed_work_quantitiy / m_ordersheet.production_quantity * 100), 0), '%') AS avg_pack_order,
    ROUND(AVG(t1010.import_q), 0) AS avg_import_q,
    CONCAT(ROUND(AVG(t1010.import_q / m_ordersheet.production_quantity * 100), 0), '%') AS avg_import_order
FROM
    m_ordersheet
        LEFT JOIN
    t_press ON t_press.ordersheet_id = m_ordersheet.id
        LEFT JOIN
    m_production_numbers ON m_ordersheet.production_numbers_id = m_production_numbers.id
        LEFT JOIN
    m_dies ON m_production_numbers.id = m_dies.production_number_id
        LEFT JOIN
    (SELECT 
        t_using_aging_rack.t_press_id,
        SUM(IFNULL(t_using_aging_rack.work_quantity, 0)) AS work_quantity,
        SUM(IFNULL((SELECT 
                SUM(t_press_quality.ng_quantities)
            FROM
                t_press_quality
            WHERE
                t_press_quality.using_aging_rack_id = t_using_aging_rack.id
            GROUP BY t_press_quality.using_aging_rack_id), 0)) AS total_ng
    FROM
        t_using_aging_rack
    GROUP BY t_using_aging_rack.t_press_id) t10 ON t10.t_press_id = t_press.id
        LEFT JOIN
    (SELECT 
        IFNULL(SUM(t_packing_box.work_quantity), 0) AS packed_work_quantitiy
    FROM
        t_packing_box
    LEFT JOIN t_packing_box_number ON t_packing_box.box_number_id = t_packing_box_number.id
    LEFT JOIN m_ordersheet ON t_packing_box_number.m_ordersheet_id = m_ordersheet.id) t20 ON 1 = 1
        LEFT JOIN
    (SELECT 
        SUM(quantity) AS import_q
    FROM
        t_import
    ) t1010 ON 1 = 1
WHERE 
    (m_ordersheet.ordersheet_number LIKE '%$search%' OR
    m_production_numbers.production_number LIKE '%$search%')
    AND m_ordersheet.issue_date_at BETWEEN '$start_term' AND '$end_term';

";
    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo ($e->errorInfo[2]);
}
?>