<?php
$userid = "webuser";
$passwd = "";

try {
    $dbh = new PDO(
        'mysql:host=localhost;dbname=extrusion;charset=utf8',
        $userid,
        $passwd,
        array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false)
    );

    $record_id = $_POST['record_id'] ?? null;
    $file_group = $_POST['file_group'] ?? null;

    if (!$record_id || !$file_group) {
        echo json_encode(["status" => "error", "message" => "Missing record_id or file_group"]);
        exit;
    }

    if (!isset($_FILES['file'])) {
        echo json_encode(["status" => "error", "message" => "No file uploaded"]);
        exit;
    }

    $fileName = basename($_FILES['file']['name']);
    $tmpName = $_FILES['file']['tmp_name'];

    // Folder theo group
    $uploadDir = "C:/xampp/htdocs/diereport/ex0.11/upload/Maintenance/" . ($file_group === "before" ? "before/" : "after/");
    if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($tmpName, $targetPath)) {

        $table = ($file_group === "before") ? "t_maintenance_file_before" : "t_maintenance_file_after";

        try {
            $sql = "INSERT INTO $table (maintenance_record_id, file_name) VALUES (:id, :name)";
            $stmt = $dbh->prepare($sql);
            $stmt->bindValue(":id", $record_id, PDO::PARAM_INT);
            $stmt->bindValue(":name", $fileName);
            $stmt->execute();

            echo json_encode(["status" => "success", "file" => $fileName]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => "DB insert failed: " . $e->getMessage()]);
        }

    } else {
        echo json_encode(["status" => "error", "message" => "Failed to move file"]);
    }

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "DB connection failed: " . $e->getMessage()]);
}
?>
