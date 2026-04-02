<?php
/* 21/06/22作成 - updated */

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

    $sql = "
        SELECT 
            m_ordersheet.id AS order_id,
            m_ordersheet.ordersheet_number,
            m_production_numbers.production_number,
            m_ordersheet.production_quantity,

            (
                SELECT IFNULL(SUM(ti.quantity), 0)
                FROM t_import ti
                WHERE ti.ordersheet_id = m_ordersheet.id
            ) AS total_import,

            ROUND(
                (
                    (
                        SELECT IFNULL(SUM(ti.quantity), 0)
                        FROM t_import ti
                        WHERE ti.ordersheet_id = m_ordersheet.id
                    ) / NULLIF(m_ordersheet.production_quantity, 0)
                ) * 100, 0
            ) AS import_percentage

        FROM m_ordersheet
        LEFT JOIN m_production_numbers 
            ON m_production_numbers.id = m_ordersheet.production_numbers_id
        ORDER BY m_ordersheet.id DESC
    ";

    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);

} catch (PDOException $e) {
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}

$dbh = null;
?>