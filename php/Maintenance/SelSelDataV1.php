<?php
$userid = "webuser";
$passwd = "";

try {
    $dbh = new PDO(
        'mysql:host=localhost;dbname=extrusion;charset=utf8',
        $userid,
        $passwd,
        array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false)
    );

    $targetId = isset($_POST["targetId"]) ? (int)$_POST["targetId"] : 0;
    if (!$targetId) {
        echo json_encode(["status"=>"error","message"=>"Missing targetId"]);
        exit;
    }

    // Lấy record
    $prepare = $dbh->prepare("
        SELECT 
            t_maintenance_record.id,
            t_maintenance_record.line_id,
            m_line_production.line,
            t_maintenance_record.machine_id,
            m_maintenance_machine.machine,
            t_maintenance_record.date_occur,
            t_maintenance_record.date_repair,
            t_maintenance_record.re_content,
            t_maintenance_record.detail,
            t_maintenance_record.cause,
            t_maintenance_record.tre_detail,
            t_maintenance_record.pro_id,
            t_maintenance_record.repair_time,
            t_maintenance_record.person_repair,
            t_maintenance_record.equip_status_id,
            m_equipment_status.equip_status,
            t_maintenance_record.work_type_id
        FROM t_maintenance_record
        LEFT JOIN m_line_production ON m_line_production.id = t_maintenance_record.line_id
        LEFT JOIN
        m_equipment_status ON m_equipment_status.id = t_maintenance_record.equip_status_id
        LEFT JOIN m_maintenance_machine ON m_maintenance_machine.id = t_maintenance_record.machine_id
        WHERE t_maintenance_record.id = :targetId
    ");
    $prepare->bindValue(':targetId', $targetId, PDO::PARAM_INT);
    $prepare->execute();
    $record = $prepare->fetch(PDO::FETCH_ASSOC);

    if (!$record) {
        echo json_encode(["status"=>"error","message"=>"Record not found"]);
        exit;
    }

    // Lấy file before
    $stmt = $dbh->prepare("SELECT file_name FROM t_maintenance_file_before WHERE maintenance_record_id = :id ORDER BY id ASC LIMIT 4");
    $stmt->bindValue(":id", $targetId, PDO::PARAM_INT);
    $stmt->execute();
    $files_before = $stmt->fetchAll(PDO::FETCH_COLUMN);
    while (count($files_before) < 4) $files_before[] = null;

    // Lấy file after
    $stmt = $dbh->prepare("SELECT file_name FROM t_maintenance_file_after WHERE maintenance_record_id = :id ORDER BY id ASC LIMIT 4");
    $stmt->bindValue(":id", $targetId, PDO::PARAM_INT);
    $stmt->execute();
    $files_after = $stmt->fetchAll(PDO::FETCH_COLUMN);
    while (count($files_after) < 4) $files_after[] = null;

    // Trả về JSON
    echo json_encode([
        "status" => "success",
        "record" => $record,
        "files_before" => $files_before,
        "files_after" => $files_after
    ]);

} catch (PDOException $e) {
    echo json_encode(["status"=>"error","message"=>$e->getMessage()]);
}
$dbh = null;