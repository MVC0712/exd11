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
        "ID",
        "Press Date",
        "Die number",
        "Pressing Type",
        "Number of racks used"
    ];

    $export_sql = "
    SELECT
    t_press.id,
    t_press.press_date_at,
    m_dies.die_number,
    t_press.pressing_type_id,
    COALESCE(MAX(t_using_aging_rack.order_number), 'Chưa cắt') AS rack_number
FROM
    t_press
LEFT JOIN
    m_dies ON m_dies.id = t_press.dies_id
LEFT JOIN
    t_using_aging_rack ON t_using_aging_rack.t_press_id = t_press.id
GROUP BY
    t_press.id,
    t_press.press_date_at,
    m_dies.die_number,
    t_press.pressing_type_id
ORDER BY
    t_press.press_date_at DESC;
    ";

    $file = new SplFileObject($file_path, "w");

    // Fix lỗi font Excel (UTF-8 BOM)
    $file->fwrite("\xEF\xBB\xBF");

    // Ghi header
    $file->fputcsv($export_header);

    $stmt = $dbh->query($export_sql);

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $file->fputcsv([
            $row['id'],
            $row['press_date_at'],
            $row['die_number'],
            $row['pressing_type_id'],
            $row['rack_number']
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