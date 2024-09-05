<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}
$targetId = "";
$targetId = $_POST['targetId'];
try {
    $sql = "SELECT 
    CONCAT(production_number_id,
            '-',
            ex_production_numbers_id) AS production_number_id,
    t_drawing.production_date,
    t_drawing.production_time_start,
    t_drawing.production_time_end,
    t_drawing.staff_id,
    t_drawing.drawing_type_id,
    t_drawing.ordersheet_id,
    t_drawing.die_number_id,
    t_drawing.die_status_id,
    t_drawing.die_status_note,
    t_drawing.plug_number_id,
    t_drawing.plug_status_id,
    t_drawing.plug_status_note,
    t_drawing.buloong_a1,
    t_drawing.buloong_a2,
    t_drawing.buloong_b1,
    t_drawing.buloong_b2,
    t_drawing.buloong_c1,
    t_drawing.buloong_c2,
    t_drawing.buloong_d1,
    t_drawing.buloong_d2,
    t_drawing.conveyor_height,
    t_drawing.conveyor_height_note,
    t_drawing.compress_dim,
    t_drawing.compress_dim_note,
    t_drawing.compress_pressure,
    t_drawing.compress_pressure_note,
    t_drawing.clamp_pressure,
    t_drawing.clamp_pressure_note,
    t_drawing.start_pull_speed,
    t_drawing.main_pull_speed,
    t_drawing.end_pull_speed,
    t_drawing.pusher_speed,
    t_drawing.puller_force,
    t_drawing.cutting_date,
    t_drawing.cutting_staff_id,
    t_drawing.file_url,
    t_drawing.straight,
    t_drawing.angle,
    t_drawing.roller_dis,
    t_drawing.roller_speed
FROM
    tube_drawing.t_drawing
        LEFT JOIN
    tube_drawing.m_production_numbers ON tube_drawing.m_production_numbers.id = tube_drawing.t_drawing.production_number_id
WHERE tube_drawing.t_drawing.id = '$targetId'";
    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo ($e->errorInfo[2]);
}
?>