<?php
$userid = "webuser";
$passwd = "";

$filterLine = $_POST['line'] ?? null;
$filterMachine = $_POST['machine'] ?? null;
$filterStatus = $_POST['status'] ?? null;
$startTerm = $_POST['start_term'] ?? null;
$endTerm = $_POST['end_term'] ?? null;

try {
    $dbh = new PDO(
        'mysql:host=localhost; dbname=extrusion; charset=utf8',
        $userid,
        $passwd,
        array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false)
    );

    $sql = "
        SELECT 
            t_maintenance_record.id,
            t_maintenance_record.line_id,
            m_line_production.line,
            t_maintenance_record.machine_id,
            m_maintenance_machine.machine,
            DATE_FORMAT(t_maintenance_record.date_occur, '%y-%m-%d') AS date_occur,
            DATE_FORMAT(t_maintenance_record.date_repair, '%y-%m-%d') AS date_repair,
            t_maintenance_record.re_no,
            t_maintenance_record.re_content,
            t_maintenance_record.result,
            t_maintenance_record.cause,
            t_maintenance_record.tre_detail,
            t_maintenance_record.pro_id,
            t_maintenance_record.repair_time,
            t_maintenance_record.person_repair,
            t_maintenance_record.equip_status_id,
            m_equipment_status.equip_status
        FROM t_maintenance_record
            LEFT JOIN m_line_production ON m_line_production.id = t_maintenance_record.line_id
            LEFT JOIN m_equipment_status ON m_equipment_status.id = t_maintenance_record.equip_status_id
            LEFT JOIN m_maintenance_machine ON m_maintenance_machine.id = t_maintenance_record.machine_id
        WHERE 1=1
    ";

    $params = [];

    if ($filterLine && $filterLine != 0) {
        $sql .= " AND t_maintenance_record.line_id = :line_id";
        $params[':line_id'] = $filterLine;
    }
    if ($filterMachine && $filterMachine != 0) {
        $sql .= " AND t_maintenance_record.machine_id = :machine_id";
        $params[':machine_id'] = $filterMachine;
    }
    if ($filterStatus && $filterStatus != 0) {
        $sql .= " AND t_maintenance_record.equip_status_id = :status_id";
        $params[':status_id'] = $filterStatus;
    }
    if ($startTerm) {
        $sql .= " AND t_maintenance_record.date_occur >= :start_term";
        $params[':start_term'] = $startTerm;
    }
    if ($endTerm) {
        $sql .= " AND t_maintenance_record.date_occur <= :end_term";
        $params[':end_term'] = $endTerm;
    }

    $stmt = $dbh->prepare($sql);
    $stmt->execute($params);

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);

} catch (PDOException $e) {
    echo json_encode(["status"=>"ERROR","message"=>$e->getMessage()]);
}
$dbh = null;
?>
