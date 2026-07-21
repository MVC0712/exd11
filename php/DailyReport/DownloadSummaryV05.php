<?php
$userid = "webuser";
$passwd = "";

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

    $file_path = "../../download/prsdt.csv";

    // Tạo thư mục nếu chưa có
    if (!file_exists(dirname($file_path))) {
        mkdir(dirname($file_path), 0777, true);
    }

    // Header CSV
    $export_header = [
    "Packing Date",
    "Total Racks"
];

    $export_sql = "
    SELECT
    DATE(t_packing.packing_date) AS packing_date,
    COUNT(DISTINCT t_packing_box.using_aging_rack_id) AS total_racks
FROM
    t_packing
LEFT JOIN
    t_packing_box ON t_packing_box.packing_id = t_packing.id
GROUP BY
    DATE(t_packing.packing_date)
ORDER BY
    packing_date DESC;
    ";

    $file = new SplFileObject($file_path, "w");

    // Fix lỗi font Excel (UTF-8 BOM)
    $file->fwrite("\xEF\xBB\xBF");

    // Ghi header
    $file->fputcsv($export_header);

    $stmt = $dbh->query($export_sql);

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $file->fputcsv([
        $row['packing_date'],
        $row['total_racks']
    ]);
}

    echo json_encode([
        "status" => "success",
        "message" => "CSV file created",
        "path" => $file_path
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

$dbh = null;