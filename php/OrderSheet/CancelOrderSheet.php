<?php
$userid = "webuser";
$passwd = "";

$id = $_POST["id"];
$packed = $_POST["packed"];

try {
    $dbh = new PDO(
        'mysql:host=localhost;dbname=extrusion;charset=utf8',
        $userid,
        $passwd,
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        )
    );

    if ($packed == 0) {

        // XÓA nếu chưa có sản xuất
        $sql = "DELETE FROM m_ordersheet WHERE id = :id";

    } else {

        // UPDATE status
        $sql = "UPDATE m_ordersheet 
                SET status = 'Hủy CTSX' 
                WHERE id = :id";
    }

    $stmt = $dbh->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(["result" => "OK"]);

} catch (PDOException $e) {
    echo json_encode(["result" => "NG", "msg" => $e->getMessage()]);
}
?>