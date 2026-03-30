<?php
header("Content-Type: application/json; charset=UTF-8");

$uploadDir = "../../../upload/Maintenance/";
if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

if (!isset($_FILES['files'])) {
  echo json_encode(["status" => "error", "message" => "No files received."]);
  exit;
}

$countfiles = count($_FILES['files']['name']);
$validExt = ["jpg", "jpeg", "png", "pdf", "doc", "docx"];
$uploaded = 0;
$fileNames = [];

for ($i = 0; $i < $countfiles; $i++) {
  $filename = basename($_FILES['files']['name'][$i]);
  $targetPath = $uploadDir . $filename;
  $ext = strtolower(pathinfo($targetPath, PATHINFO_EXTENSION));

  if (!in_array($ext, $validExt)) continue;
  if ($_FILES['files']['error'][$i] !== 0) continue;

  if (move_uploaded_file($_FILES['files']['tmp_name'][$i], $targetPath)) {
    $uploaded++;
    $fileNames[] = $filename;
  }
}

echo json_encode([
  "status" => "success",
  "uploaded_count" => $uploaded,
  "file_names" => $fileNames
]);
exit;
?>
