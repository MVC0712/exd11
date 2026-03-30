<?php
$userid = "webuser";
$passwd = "";

$record_id = $_POST['record_id'] ?? null;
$line = $_POST['line'] ?? null;
$machine = $_POST['machine'] ?? null;
$date_occur = $_POST['date_occur'] ?? null;
$date_repair = $_POST['date_repair'] ?? null;
$re_no = $_POST['re_no'] ?? null;
$re_content = $_POST['re_content'] ?? null;
$detail = $_POST['detail'] ?? null;
$cause = $_POST['cause'] ?? null;
$tre_detail = $_POST['tre_detail'] ?? null;
$pro_id = $_POST['pro_id'] ?? null;
$repair_time = $_POST['repair_time'] ?? null;
$person_repair = $_POST['person_repair'] ?? null;
$equip_status = $_POST['equip_status'] ?? null;

if (!$record_id) {
    echo json_encode(["status"=>"ERROR","message"=>"Missing record_id"]);
    exit;
}

try {
    $dbh = new PDO(
        'mysql:host=localhost; dbname=extrusion;charset=utf8',
        $userid,
        $passwd,
        [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES=>false]
    );

    $sql = "UPDATE t_maintenance_record SET
                line_id = :line,
                machine_id = :machine,
                date_occur = :date_occur,
                date_repair = :date_repair,
                re_no = :re_no,
                re_content = :re_content,
                detail = :detail,
                cause = :cause,
                tre_detail = :tre_detail,
                pro_id = :pro_id,
                repair_time = :repair_time,
                person_repair = :person_repair,
                equip_status_id = :equip_status
            WHERE id = :record_id";

    $stmt = $dbh->prepare($sql);
    $stmt->bindValue(':line', $line);
    $stmt->bindValue(':machine', $machine);
    $stmt->bindValue(':date_occur', $date_occur ?: null);
    $stmt->bindValue(':date_repair', $date_repair ?: null);
    $stmt->bindValue(':re_no', $re_no);
    $stmt->bindValue(':re_content', $re_content);
    $stmt->bindValue(':detail', $detail);
    $stmt->bindValue(':cause', $cause);
    $stmt->bindValue(':tre_detail', $tre_detail);
    $stmt->bindValue(':pro_id', $pro_id);
    $stmt->bindValue(':repair_time', $repair_time);
    $stmt->bindValue(':person_repair', $person_repair);
    $stmt->bindValue(':equip_status', $equip_status);
    $stmt->bindValue(':record_id', $record_id);

    $stmt->execute();

    echo json_encode(["status"=>"UPDATED"]);

} catch (PDOException $e) {
    echo json_encode(["status"=>"ERROR","message"=>$e->getMessage()]);
}
$dbh = null;
?>
