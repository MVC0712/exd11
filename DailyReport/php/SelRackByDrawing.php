<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}
$drawing_id = $_POST['drawing_id'];
try {
    $sql = "SELECT 
        tube_drawing.t_used_extrusion_rack.id,
        extrusion.t_press.press_date_at,
        extrusion.t_using_aging_rack.rack_number,
        tube_drawing.t_used_extrusion_rack.quantity AS quantity
    FROM tube_drawing.t_used_extrusion_rack
    LEFT JOIN extrusion.t_using_aging_rack ON extrusion.t_using_aging_rack.id = tube_drawing.t_used_extrusion_rack.using_aging_rack_id
    LEFT JOIN extrusion.t_press ON extrusion.t_press.id = extrusion.t_using_aging_rack.t_press_id
    WHERE tube_drawing.t_used_extrusion_rack.drawing_id = '$drawing_id'
    ORDER BY tube_drawing.t_used_extrusion_rack.ordinal ASC";
    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo $e;
}
?>