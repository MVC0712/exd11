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

    // Header CSV
    $export_header = [
        "ID",
        "Rack Number",
        "Ma khuon",
        "Ngay dun",
        "So thanh",
        "So thanh da dong goi",
        "So thanh NG",  
        "So thanh con lai"
    ];

    $export_sql = "
        SELECT
            t_using_aging_rack.id,
            t_using_aging_rack.rack_number,
            m_dies.die_number,
            t_press.press_date_at,
            t_using_aging_rack.work_quantity,
            SUM(t_packing_box.work_quantity) AS packing_box_quantity,
            (
                SELECT SUM(tpq.ng_quantities)
                FROM t_press_quality tpq
                WHERE tpq.using_aging_rack_id = t_using_aging_rack.id
            ) AS total_ng_quantity,
            t_using_aging_rack.work_quantity - SUM(t_packing_box.work_quantity) - COALESCE((SELECT SUM(tpq.ng_quantities) FROM t_press_quality tpq WHERE tpq.using_aging_rack_id = t_using_aging_rack.id), 0) AS remaining_quantity
        FROM t_using_aging_rack
        LEFT JOIN t_press ON t_using_aging_rack.t_press_id = t_press.id
        LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
        LEFT JOIN t_packing_box ON t_using_aging_rack.id = t_packing_box.using_aging_rack_id
        GROUP BY t_using_aging_rack.id
        HAVING remaining_quantity <> 0
        ORDER BY t_using_aging_rack.rack_number ASC, t_using_aging_rack.id DESC
    ";

    if (touch($file_path)) {
        $file = new SplFileObject($file_path, "w");

        // Fix lỗi font Excel (UTF-8 BOM)
        $file->fwrite("\xEF\xBB\xBF");

        $file->fputcsv($export_header);

        $stmt = $dbh->prepare($export_sql);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $file->fputcsv([
                $row['id'],
                $row['rack_number'],
                $row['die_number'],
                $row['press_date_at'],
                $row['work_quantity'],
                $row['packing_box_quantity'],
                $row['total_ng_quantity'],
                $row['remaining_quantity'],
            ]);
        }
    }

    echo json_encode("Made a CSV file");

} catch (PDOException $e) {
    echo "SQL ERROR: " . $e->getMessage();
}

$dbh = null;