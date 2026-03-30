<?php

$userid = "webuser";
$passwd = "";

// nhận dữ liệu từ GET
$start = $_GET['start_date'] ?? "";
$end   = $_GET['end_date'] ?? "";

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

    $where = "";
    if ($start != "" && $end != "") {
        $where = " WHERE t_packing.packing_date BETWEEN :start AND :end ";
    }

    $sql = "
        SELECT
            DATE_FORMAT(t_packing.packing_date, '%Y-%m-%d') AS Date,
            TIME_FORMAT(t_packing.packing_start, '%H:%i') AS Start,
            TIME_FORMAT(t_packing.packing_end, '%H:%i') AS End,
            m_ordersheet.production_numbers_id AS Production_ID,
            m_production_numbers.production_number AS Production_Number,
            SUM(t_packing_box.work_quantity) AS Total_Quantity,
            (
            SELECT
              COUNT(DISTINCT t_packing_box.box_number_id)
            FROM
              t_packing_box
            WHERE
              t_packing_box.packing_id = t_packing.id
          ) AS number_of_making_box
        FROM
            t_packing
        LEFT JOIN m_ordersheet
            ON t_packing.m_ordersheet_id = m_ordersheet.id
        LEFT JOIN m_production_numbers
            ON m_ordersheet.production_numbers_id = m_production_numbers.id
        LEFT JOIN t_packing_box
            ON t_packing_box.packing_id = t_packing.id
        $where
        GROUP BY
    m_production_numbers.production_number,
    DATE_FORMAT(t_packing.packing_date, '%Y-%m-%d')
        ORDER BY
    t_packing.packing_date DESC,
    t_packing.packing_start ASC
    ";

    $stmt = $dbh->prepare($sql);

    if ($start != "" && $end != "") {
        $stmt->bindValue(':start', $start, PDO::PARAM_STR);
        $stmt->bindValue(':end', $end, PDO::PARAM_STR);
    }

    $stmt->execute();

    // header download
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="packing.csv"');

    $file = fopen('php://output', 'w');

    // Excel UTF-8 BOM
    fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

    // header CSV
    fputcsv($file, [
        "Date",
        "Start",
        "End",
        "Production ID",
        "Production Number",
        "Quantity",
        "Total Box"
    ]);

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        fputcsv($file, $row);
    }

    fclose($file);

} catch (PDOException $e) {

    echo $e->getMessage();

}

$dbh = null;
?>