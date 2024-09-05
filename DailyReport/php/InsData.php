<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}

$production_number_id = $_POST['production_number_id'];
$production_date = $_POST['production_date'];
$production_time_start = $_POST['production_time_start'];
$production_time_end = $_POST['production_time_end'];
$staff_id = $_POST['staff_id'];
$drawing_type_id = $_POST['drawing_type_id'];
$ordersheet_id = $_POST['ordersheet_id'];
$die_number_id = $_POST['die_number_id'];
$die_status_id = $_POST['die_status_id'];
$die_status_note = $_POST['die_status_note'];
$plug_number_id = $_POST['plug_number_id'];
$plug_status_id = $_POST['plug_status_id'];
$plug_status_note = $_POST['plug_status_note'];
$buloong_a1 = $_POST['buloong_a1'];
$buloong_a2 = $_POST['buloong_a2'];
$buloong_b1 = $_POST['buloong_b1'];
$buloong_b2 = $_POST['buloong_b2'];
$buloong_c1 = $_POST['buloong_c1'];
$buloong_c2 = $_POST['buloong_c2'];
$buloong_d1 = $_POST['buloong_d1'];
$buloong_d2 = $_POST['buloong_d2'];
$conveyor_height = $_POST['conveyor_height'];
$conveyor_height_note = $_POST['conveyor_height_note'];
$compress_dim = $_POST['compress_dim'];
$compress_dim_note = $_POST['compress_dim_note'];
$compress_pressure = $_POST['compress_pressure'];
$compress_pressure_note = $_POST['compress_pressure_note'];
$clamp_pressure = $_POST['clamp_pressure'];
$clamp_pressure_note = $_POST['clamp_pressure_note'];
$start_pull_speed = $_POST['start_pull_speed'];
$main_pull_speed = $_POST['main_pull_speed'];
$end_pull_speed = $_POST['end_pull_speed'];
$pusher_speed = $_POST['pusher_speed'];
$puller_force = $_POST['puller_force'];
$cutting_date = $_POST['cutting_date'];
$cutting_staff_id = $_POST['cutting_staff_id'];
$file_url = $_POST['file_url'];
$straight = $_POST['straight'];
$angle = $_POST['angle'];
$roller_dis = $_POST['roller_dis'];
$roller_speed = $_POST['roller_speed'];
try {
    $sql = "INSERT INTO t_drawing (
                production_number_id, production_date, production_time_start, production_time_end, drawing_type_id,
                staff_id, ordersheet_id, die_number_id, die_status_note, plug_number_id, plug_status_note, die_status_id, plug_status_id,
                buloong_a1, buloong_a2, buloong_b1, buloong_b2, buloong_c1, buloong_c2, 
                buloong_d1, buloong_d2, conveyor_height, conveyor_height_note, compress_dim, compress_dim_note, 
                compress_pressure, compress_pressure_note, clamp_pressure, clamp_pressure_note, 
                start_pull_speed, main_pull_speed, end_pull_speed, pusher_speed, cutting_date, cutting_staff_id, file_url,
                straight, angle, roller_dis, roller_speed, puller_force)
            VALUES (
                '$production_number_id','$production_date','$production_time_start','$production_time_end', '$drawing_type_id',
                '$staff_id','$ordersheet_id','$die_number_id','$die_status_note','$plug_number_id','$plug_status_note', '$die_status_id', '$plug_status_id',
                '$buloong_a1','$buloong_a2','$buloong_b1','$buloong_b2','$buloong_c1','$buloong_c2',
                '$buloong_d1','$buloong_d2','$conveyor_height','$conveyor_height_note','$compress_dim','$compress_dim_note',
                '$compress_pressure','$compress_pressure_note','$clamp_pressure','$clamp_pressure_note',
                '$start_pull_speed','$main_pull_speed','$end_pull_speed','$pusher_speed','$cutting_date','$cutting_staff_id','$file_url',
                '$straight', '$angle', '$roller_dis', '$roller_speed', '$puller_force')";
    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();

    $stmt = $dbh->getInstance()->prepare("SELECT MAX(t_drawing.id) AS id FROM t_drawing");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo ($e->errorInfo[2]);
}
?>