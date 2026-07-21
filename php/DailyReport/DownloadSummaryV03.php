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
        "Order sheet",
        "Production number",
        "Import date",
        "Quantity",
    ];

    $export_sql = "
        SELECT
            t_import.id,
            m_ordersheet.ordersheet_number,
            m_production_numbers.production_number,
            DATE_FORMAT(t_import.import_at, '%d/%m/%Y') AS import_at,
            t_import.quantity
        FROM
            extrusion.t_import
        LEFT JOIN
            m_ordersheet ON m_ordersheet.id = t_import.ordersheet_id
        LEFT JOIN
            m_production_numbers ON m_production_numbers.id = m_ordersheet.production_numbers_id
        ORDER BY
            t_import.import_at DESC
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
            $row['ordersheet_number'],
            $row['production_number'],
            $row['import_at'],
            $row['quantity'],
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