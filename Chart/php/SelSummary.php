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
    m_ordersheet.ordersheet_number,
    DATE_FORMAT(m_ordersheet.delivery_date_at,
            '%y-%m-%d') AS delivery_date_at,
    DATE_FORMAT(m_ordersheet.issue_date_at, '%y-%m-%d') AS issue_date_at,
    m_production_numbers.production_number,
    LEFT(m_dies.die_number, CHAR_LENGTH(m_dies.die_number) - 5) AS die_number,
    IFNULL(FORMAT(m_ordersheet.production_quantity,
                0),
            0) AS production_quantity,
    IFNULL(FORMAT(SUM(t10.work_quantity), 0), 0) AS work_quantity,
    IFNULL(FORMAT(SUM(t10.total_ng), 0), 0) AS total_ng,
    IFNULL(FORMAT((SUM(t10.work_quantity) - SUM(t10.total_ng)),
                0),
            0) AS total_ok,
    CONCAT((ROUND((IFNULL(REPLACE(FORMAT((SUM(t10.work_quantity) - SUM(t10.total_ng)), 0), ',', ''), 0) / 
    IFNULL(REPLACE(FORMAT(m_ordersheet.production_quantity, 0), ',', ''), 0))* 100, 0)), '%') AS 'ok/order',
    FORMAT(t20.packed_work_quantitiy, 0) AS packed,
    CONCAT(ROUND(((REPLACE(FORMAT(t20.packed_work_quantitiy, 0), ',', '') /
    IFNULL(REPLACE(FORMAT(m_ordersheet.production_quantity, 0), ',', ''), 0))*100), 0), '%') AS 'pack/order',
    IFNULL(t1010.import_q, 0) AS import_q,
    CONCAT(ROUND(((REPLACE(IFNULL(t1010.import_q, 0), ',', '') /
    IFNULL(REPLACE(IFNULL(m_ordersheet.production_quantity, 0), ',', ''), 0))*100), 0), '%') AS 'import/order'
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
        m_ordersheet.id AS m_ordersheet_id,
            m_ordersheet.ordersheet_number,
            m_ordersheet.delivery_date_at,
            m_ordersheet.production_quantity,
            IFNULL(SUM(t_packing_box.work_quantity), 0) AS packed_work_quantitiy,
            m_production_numbers.production_number
    FROM
        m_ordersheet
    LEFT JOIN t_packing_box_number ON t_packing_box_number.m_ordersheet_id = m_ordersheet.id
    LEFT JOIN t_packing_box ON t_packing_box.box_number_id = t_packing_box_number.id
    LEFT JOIN m_production_numbers ON m_ordersheet.production_numbers_id = m_production_numbers.id
    GROUP BY m_ordersheet.id) t20 ON t20.m_ordersheet_id = m_ordersheet.id
        LEFT JOIN
    (SELECT 
        m_ordersheet.id AS order_id, SUM(quantity) AS import_q
    FROM
        extrusion.t_import
    LEFT JOIN m_ordersheet ON m_ordersheet.id = t_import.ordersheet_id
    LEFT JOIN m_production_numbers ON m_production_numbers.id = m_ordersheet.production_numbers_id
    GROUP BY ordersheet_id) t1010 ON t1010.order_id = m_ordersheet.id
WHERE 
    (m_ordersheet.ordersheet_number LIKE '%$search%' OR
    m_production_numbers.production_number LIKE '%$search%') AND
    m_ordersheet.issue_date_at BETWEEN '$start_term' AND '$end_term'
GROUP BY m_ordersheet.id
ORDER BY m_ordersheet.issue_date_at DESC, m_ordersheet.delivery_date_at DESC, m_ordersheet.ordersheet_number DESC;";
    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo ($e->errorInfo[2]);
}
?>