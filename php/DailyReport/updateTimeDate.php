<?php
$userid = "webuser";
$passwd = "";

$data = file_get_contents('php://input');
$data_json = json_decode($data, true);

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

    $stmt = $dbh->prepare("UPDATE t_time_press SET time_date = :time_date WHERE id = :id");

    foreach ($data_json as $row) {
        if (!is_array($row) || count($row) < 6) continue;

        $id = $row[0];
        $newDate = $row[5];

        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':time_date', $newDate);
        $stmt->execute();
    }

    echo json_encode(["status" => "success", "message" => "Cập nhật ngày thành công"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
