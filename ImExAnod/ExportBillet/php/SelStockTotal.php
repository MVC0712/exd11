<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}
try {
    $sql = "SELECT 
    'Total ' AS mtname,
    SUM(t_import.quantity) AS quantity,
    SUM(CASE
        WHEN billet_length = 1 THEN 132 * t_import.quantity
        ELSE 66 * t_import.quantity
    END) AS ww
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
GROUP BY m_dimention.dimention;";
    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo $e;
}
?>