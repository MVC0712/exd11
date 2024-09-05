<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}
$press_id = $_POST['press_id'];
try {
    $sql = "SELECT 
    extrusion.t_using_aging_rack.id,
    extrusion.t_using_aging_rack.rack_number,
    extrusion.t_using_aging_rack.work_quantity - IFNULL((SELECT 
                    SUM(extrusion.t_press_quality.ng_quantities)
                FROM
                    extrusion.t_press_quality
                WHERE
                    extrusion.t_press_quality.using_aging_rack_id = extrusion.t_using_aging_rack.id),
            0) - IFNULL(t1.used_qty, 0) AS ok_qty,
    extrusion.t_using_aging_rack.work_quantity - IFNULL((SELECT 
                    SUM(extrusion.t_press_quality.ng_quantities)
                FROM
                    extrusion.t_press_quality
                WHERE
                    extrusion.t_press_quality.using_aging_rack_id = extrusion.t_using_aging_rack.id),
            0) - IFNULL(t1.used_qty, 0) AS max_qty
FROM
    extrusion.t_using_aging_rack
        LEFT JOIN
    (SELECT 
        tube_drawing.t_used_extrusion_rack.using_aging_rack_id AS idd,
            SUM(quantity) AS used_qty
    FROM
        tube_drawing.t_used_extrusion_rack
    GROUP BY tube_drawing.t_used_extrusion_rack.using_aging_rack_id) t1 ON t1.idd = extrusion.t_using_aging_rack.id
WHERE
    extrusion.t_using_aging_rack.t_press_id = '$press_id'
ORDER BY extrusion.t_using_aging_rack.order_number";
    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo $e;
}
?>