<?php
$userid = "webuser";
$passwd = "";

try {
    $dbh = new PDO(
        'mysql:host=localhost;dbname=extrusion;charset=utf8',
        $userid,
        $passwd,
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        )
    );

    // Lấy dữ liệu từ POST
    $line = $_POST['line'];
    $machine = $_POST['machine'];
    $date_occur = $_POST['date_occur'];
    $date_repair = $_POST['date_repair'];
    $re_no = $_POST['re_no'];
    $re_content = $_POST['re_content'];
    $detail = $_POST['detail'];
    $cause = $_POST['cause'];
    $tre_detail = $_POST['tre_detail'];
    $pro_id = $_POST['pro_id'];
    $repair_time = $_POST['repair_time'];
    $person_repair = $_POST['person_repair'];
    $equip_status = $_POST['equip_status'];

    $sql = "INSERT INTO t_maintenance_record 
            (line, machine, date_occur, date_repair, re_no, re_content, detail, cause, tre_detail, pro_id, repair_time, person_repair, equip_status)
            VALUES 
            (:line, :machine, :date_occur, :date_repair, :re_no, :re_content, :detail, :cause, :tre_detail, :pro_id, :repair_time, :person_repair, :equip_status)";
    
    $stmt = $dbh->prepare($sql);
    $stmt->execute([
        ':line' => $line,
        ':machine' => $machine,
        ':date_occur' => $date_occur,
        ':date_repair' => $date_repair,
        ':re_no' => $re_no,
        ':re_content' => $re_content,
        ':detail' => $detail,
        ':cause' => $cause,
        ':tre_detail' => $tre_detail,
        ':pro_id' => $pro_id,
        ':repair_time' => $repair_time,
        ':person_repair' => $person_repair,
        ':equip_status' => $equip_status
    ]);

    $lastId = $dbh->lastInsertId(); // ID vừa insert
    echo json_encode(['status' => 'INSERTED', 'id' => $lastId]);

} catch (PDOException $e) {
    echo json_encode(['status' => 'ERROR', 'message' => $e->getMessage()]);
}
$dbh = null;
?>
