<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}
try {
    $sql = "SELECT 
    'aaaa',
    t_casting.code,
    CONCAT(m_material_type.material_type,
            '-',
            ROUND(m_dimention.dimention * 25.4, 0),
            '-',
            CASE
                WHEN billet_length = 1 THEN 1200
                ELSE 600
            END) AS mtname,
    SUM(t_import.quantity) AS quantity
FROM
    billet_casting.t_import
        LEFT JOIN
    t_casting ON t_casting.id = t_import.casting_id
        LEFT JOIN
    m_material_type ON m_material_type.id = t_casting.product_type
        LEFT JOIN
    m_dimention ON m_dimention.id = t_casting.product_dim
WHERE
    t_import.id NOT IN (SELECT 
            import_id
        FROM
            t_export)
GROUP BY t_casting.id , t_import.billet_length
ORDER BY t_casting.code DESC;";
    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo $e;
}
?>