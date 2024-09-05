<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}
$search = "";
$search = $_POST['search'];
try {
    $sql = "SELECT 
    m_ordersheet.id,
    m_ordersheet.ordersheet_number,
    m_ordersheet.delivery_date_at,
    m_ordersheet.issue_date_at,
    m_production_numbers.production_number,
    m_ordersheet.production_quantity,
    m_ordersheet.note,
    CONCAT(m_ordersheet.production_numbers_id,
        '-',
        m_production_numbers.ex_production_numbers_id) AS production_numbers_id
FROM
    m_ordersheet
LEFT JOIN
    m_production_numbers ON m_ordersheet.production_numbers_id = m_production_numbers.id
WHERE ordersheet_number LIKE '%$search%' OR production_number LIKE '%$search%'";
    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo ($e->errorInfo[2]);
}
?>