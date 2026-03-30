<?php
/* SelTime.php - Lấy dữ liệu bảng thời gian theo maintenance_record_id */

header("Content-Type: application/json; charset=utf-8");

$userid = "webuser";
$passwd = "";

// Nhận ID từ POST
$id = $_POST["id"] ?? null;

if (!$id) {
    echo json_encode(["error" => "No ID received"]);
    exit;
}

try {
    $dbh = new PDO(
        'mysql:host=localhost;dbname=extrusion;charset=utf8',
        $userid,
        $passwd,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    $sql = "
        SELECT 
            id,
            DATE_FORMAT(time_date, '%d-%m-%y') AS time_date,
            TIME_FORMAT(time_start, '%H:%i') AS time_start,
            TIME_FORMAT(time_end, '%H:%i') AS time_end,
            time_note
        FROM t_maintenance_time
        WHERE maintenance_record_id = :id
        ORDER BY time_date ASC
    ";

    $prepare = $dbh->prepare($sql);
    $prepare->bindValue(":id", (int)$id, PDO::PARAM_INT);
    $prepare->execute();

    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$dbh = null;
?>
