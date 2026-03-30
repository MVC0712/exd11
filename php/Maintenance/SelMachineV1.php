<?php
$userid = "webuser";
$passwd = "";

header('Content-Type: application/json; charset=utf-8');

try {
    // DB connection
    $dbh = new PDO(
        'mysql:host=localhost;dbname=extrusion;charset=utf8',
        $userid,
        $passwd,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );

    // Nhận line_id từ POST
    $line_id = isset($_POST['line_id']) ? (int)$_POST['line_id'] : 0;

    if ($line_id === 0) {
        // Lấy tất cả machine
        $sql = "
            SELECT
                id,
                machine
            FROM m_maintenance_machine
            ORDER BY id ASC
        ";
        $stmt = $dbh->query($sql);
    } else {
        // Lấy machine theo line_id
        $sql = "
            SELECT
                id,
                machine
            FROM m_maintenance_machine
            WHERE line_id = :line_id
            ORDER BY id ASC
        ";
        $stmt = $dbh->prepare($sql);
        $stmt->bindValue(':line_id', $line_id, PDO::PARAM_INT);
        $stmt->execute();
    }

    // Fetch dữ liệu
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

$dbh = null;
