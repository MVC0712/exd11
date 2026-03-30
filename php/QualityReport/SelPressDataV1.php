<?php
/* 21/07/26作成 */
$userid = "webuser";
$passwd = "";

try {
    $dbh = new PDO(
        'mysql:host=localhost; dbname=extrusion; charset=utf8',
        $userid,
        $passwd,
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        )
    );

    $prepare = $dbh->prepare("
        SELECT 
            t_press.actual_billet_quantities,
            m_pressing_type.pressing_type,
            t_press.id AS press_id,
            t_press.dimension_check_date,
            t_press.etching_check_date,
            t_press.hardness_check_date,
            CASE
                WHEN t_press.qc_check_id = 1 THEN 'Đã kiểm tra'
                WHEN t_press.qc_check_id = 2 THEN 'Đã kiểm tra'
                ELSE ''
            END AS qc_check_result,
            t_press.packing_check_date,
            t_press.qc_name_id
        FROM t_press
        LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
        LEFT JOIN m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
        WHERE t_press.press_date_at = :press_date 
          AND m_dies.id = :dies_id
    ");

    $prepare->bindValue(':press_date', $_POST["press_date"], PDO::PARAM_STR);
    $prepare->bindValue(':dies_id', (INT)$_POST["dies_id"], PDO::PARAM_INT);
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    // Map qc_name_id → tên QC
    foreach ($result as &$row) {
        switch ($row['qc_name_id']) {
            case 1:
                $row['qc_name'] = 'Chiến';
                break;
            case 2:
                $row['qc_name'] = 'Thảo';
                break;
            case 3:
                $row['qc_name'] = 'Hiệu';
                break;
            default:
                $row['qc_name'] = '';
                break;
        }
    }

    echo json_encode($result);

} catch (PDOException $e) {
    $error = $e->getMessage();
    echo json_encode($error);
}

$dbh = null;
