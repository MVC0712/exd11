<?php
header("Content-Type: application/json; charset=UTF-8");

$uploadDir = "../../../upload/Maintenance/";

// Kiểm tra xem có file gửi lên không
if (!isset($_FILES['file'])) {
    echo json_encode(["status" => "error", "message" => "No file uploaded."]);
    exit;
}

$file = $_FILES['file'];
$filename = basename($file['name']);
$targetPath = $uploadDir . $filename;
$fileType = strtolower(pathinfo($targetPath, PATHINFO_EXTENSION));
$validExt = ["jpg", "jpeg", "png", "pdf", "doc", "docx"];

// Kiểm tra lỗi
if ($file['error'] !== 0) {
    echo json_encode(["status" => "error", "message" => "Upload error: " . $file['error']]);
    exit;
}

// Kiểm tra định dạng hợp lệ
if (!in_array($fileType, $validExt)) {
    echo json_encode(["status" => "error", "message" => "Invalid file type."]);
    exit;
}

// Đảm bảo thư mục tồn tại
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Di chuyển file
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode([
        "status" => "success",
        "file_name" => $filename
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to move uploaded file."]);
}
?>
