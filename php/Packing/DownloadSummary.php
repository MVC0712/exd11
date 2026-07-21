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
            LEFT(t_packing_box_number.box_number, 10) AS Ordersheet_Number,
            (
    SELECT COUNT(DISTINCT tb.box_number_id)
    FROM t_packing_box tb
    INNER JOIN t_packing_box_number tbn
        ON tb.box_number_id = tbn.id
    WHERE tb.packing_id = t_packing.id
      AND LEFT(tbn.box_number, 10) =
          LEFT(t_packing_box_number.box_number, 10)
) AS number_of_making_box
        FROM t_packing
        LEFT JOIN m_ordersheet
            ON t_packing.m_ordersheet_id = m_ordersheet.id
        LEFT JOIN m_production_numbers
            ON m_ordersheet.production_numbers_id = m_production_numbers.id
        LEFT JOIN t_packing_box
            ON t_packing_box.packing_id = t_packing.id
        LEFT JOIN t_packing_box_number
            ON t_packing_box.box_number_id = t_packing_box_number.id
        $where
        GROUP BY
            DATE_FORMAT(t_packing.packing_date, '%Y-%m-%d'),
            TIME_FORMAT(t_packing.packing_start, '%H:%i'),
            TIME_FORMAT(t_packing.packing_end, '%H:%i'),
            m_ordersheet.production_numbers_id,
            m_production_numbers.production_number,
            LEFT(t_packing_box_number.box_number, 10),
            t_packing.id
        ORDER BY
            t_packing.packing_date ASC,
            t_packing.packing_start ASC,
            LEFT(t_packing_box_number.box_number, 10)
    ";

    $stmt = $dbh->prepare($sql);

    if ($start != "" && $end != "") {
        $stmt->bindValue(':start', $start, PDO::PARAM_STR);
        $stmt->bindValue(':end', $end, PDO::PARAM_STR);
    }

    $stmt->execute();

    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="packing.csv"');

    $file = fopen('php://output', 'w');

    // UTF-8 BOM cho Excel
    fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

    fputcsv($file, [
        "Date",
        "Start",
        "End",
        "Production ID",
        "Production Number",
        "Quantity",
        "Ordersheet Number",
        "Total Box"
    ]);

    $prevDate = '';
    $prevStart = '';
    $prevEnd = '';
    $prevProductionID = '';

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

        $isDuplicate =
            $row['Date'] === $prevDate &&
            $row['Start'] === $prevStart &&
            $row['End'] === $prevEnd &&
            $row['Production_ID'] === $prevProductionID;

        if ($isDuplicate) {
            fputcsv($file, [
                '',
                '',
                '',
                '',
                '',
                $row['Total_Quantity'],
                $row['Ordersheet_Number'],
                $row['number_of_making_box']
            ]);
        } else {

            fputcsv($file, [
                $row['Date'],
                $row['Start'],
                $row['End'],
                $row['Production_ID'],
                $row['Production_Number'],
                $row['Total_Quantity'],
                $row['Ordersheet_Number'],
                $row['number_of_making_box']
            ]);

            $prevDate = $row['Date'];
            $prevStart = $row['Start'];
            $prevEnd = $row['End'];
            $prevProductionID = $row['Production_ID'];
        }
    }

    fclose($file);

} catch (PDOException $e) {

    echo $e->getMessage();

}

$dbh = null;

?>