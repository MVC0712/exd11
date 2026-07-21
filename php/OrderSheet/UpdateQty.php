<?php

header('Content-Type: application/json');

$userid = "webuser";
$passwd = "";

// mật khẩu hệ thống
$system_password = "123";

$id = $_POST['id'] ?? null;
$qty = $_POST['production_quantity'] ?? null;
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

    $stmt = $dbh->prepare("
        UPDATE m_ordersheet
        SET production_quantity = :qty
        WHERE id = :id
    ");

    $stmt->execute([
        ':qty' => $qty,
        ':id' => $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Update success"
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$dbh = null;