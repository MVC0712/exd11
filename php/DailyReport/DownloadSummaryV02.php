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

    $export_header = [
        "ID",
        "Press Date",
        "Type ID",
        "Die Number",
        "Production Number",
        "MFG",
    ];

    $export_sql = "
    SELECT
        t_press.id,
        DATE_FORMAT(t_press.press_date_at, '%Y-%m-%d') AS press_date,
        t_press.pressing_type_id,
        m_dies.die_number,
        m_production_numbers.production_number,
        CASE 
            WHEN t_bundle.mfg = 1 THEN 'Dubai'
            WHEN t_bundle.mfg = 2 THEN 'VN'
            ELSE ''
        END AS mfg
    FROM t_press

    LEFT JOIN m_dies 
        ON t_press.dies_id = m_dies.id

    LEFT JOIN m_production_numbers 
        ON m_dies.production_number_id = m_production_numbers.id

    -- tránh duplicate bundle
    LEFT JOIN (
        SELECT 
            press_id,
            MAX(mfg) AS mfg
        FROM t_bundle
        GROUP BY press_id
    ) AS t_bundle
        ON t_press.id = t_bundle.press_id

    -- ✅ GROUP BY production_number (ĐÚNG YÊU CẦU)
    INNER JOIN (
        SELECT 
            m_production_numbers.production_number,
            MAX(t_press.id) AS max_id
        FROM t_press
        LEFT JOIN m_dies 
            ON t_press.dies_id = m_dies.id
        LEFT JOIN m_production_numbers 
            ON m_dies.production_number_id = m_production_numbers.id
        WHERE m_production_numbers.production_number IS NOT NULL
        GROUP BY m_production_numbers.production_number
    ) AS latest
        ON t_press.id = latest.max_id

    -- ✅ CHỈ LẤY pressing_type_id = 2 hoặc 3
    WHERE t_press.pressing_type_id IN (2, 3)

    ORDER BY m_production_numbers.production_number ASC
";

    if (!file_exists($file_path)) {
        touch($file_path);
    }

    $file = new SplFileObject($file_path, "w");

    $file->fwrite("\xEF\xBB\xBF");
    $file->fputcsv($export_header);

    $stmt = $dbh->prepare($export_sql);
    $stmt->execute();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $file->fputcsv([
            $row['id'],
            $row['press_date'],
            $row['pressing_type_id'],
            $row['die_number'],
            $row['production_number'],
            $row['mfg'],
        ]);
    }

    echo json_encode([
        "status" => "success",
        "message" => "CSV file created successfully",
        "file" => $file_path
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

$dbh = null;
?>