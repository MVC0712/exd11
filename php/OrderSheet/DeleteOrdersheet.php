<?php

header('Content-Type: application/json');

$userid = "webuser";
$passwd = "";

// mật khẩu hệ thống
$system_password = "321";

$id = $_POST['id'] ?? [];
$password = $_POST['password'] ?? null;

if ($password !== $system_password) {

    echo json_encode([
        "success" => false,
        "message" => "Sai mật khẩu"
    ]);
    exit;
}

try {

    $dbh = new PDO(
        'mysql:host=localhost; dbname=extrusion; charset=utf8',
        $userid,
        $passwd,
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        )
    );

    // =========================
    // CHỈ CẦN XÓA TABLE CHA
    // =========================
    $stmt = $dbh->prepare("
        DELETE FROM m_ordersheet
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Deleted successfully"
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$dbh = null;