<?php
$userid = "webuser";
$passwd = "";

// Nhận dữ liệu từ POST
$line_id = $_POST['line'] ?? null;
$machine_id = $_POST['machine'] ?? null;
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
$equip_status_id = $_POST['equip_status'] ?? null;

// 🧹 Xử lý ngày: nếu là "0000-00-00" hoặc rỗng → set null
if ($date_occur === "0000-00-00" || $date_occur === "") {
    $date_occur = null;
}
if ($date_repair === "0000-00-00" || $date_repair === "") {
    $date_repair = null;
}

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

    $sql = "INSERT INTO t_maintenance_record (
                line_id, machine_id, date_occur, date_repair, re_no, re_content,
                detail, cause, tre_detail, pro_id, repair_time,
                person_repair, equip_status_id
            ) VALUES (
                :line_id, :machine_id, :date_occur, :date_repair, :re_no, :re_content,
                :detail, :cause, :tre_detail, :pro_id, :repair_time,
                :person_repair, :equip_status_id
            )";

    $stmt = $dbh->prepare($sql);

    // Gán giá trị cho từng trường
    $stmt->bindValue(':line_id', $line_id);
    $stmt->bindValue(':machine_id', $machine_id);
    $stmt->bindValue(':date_occur', $date_occur, $date_occur ? PDO::PARAM_STR : PDO::PARAM_NULL);
    $stmt->bindValue(':date_repair', $date_repair, $date_repair ? PDO::PARAM_STR : PDO::PARAM_NULL);
    $stmt->bindValue(':re_no', $re_no);
    $stmt->bindValue(':re_content', $re_content);
    $stmt->bindValue(':detail', $detail);
    $stmt->bindValue(':cause', $cause);
    $stmt->bindValue(':tre_detail', $tre_detail);
    $stmt->bindValue(':pro_id', $pro_id);
    $stmt->bindValue(':repair_time', $repair_time);
    $stmt->bindValue(':person_repair', $person_repair);
    $stmt->bindValue(':equip_status_id', $equip_status_id);

    $stmt->execute();

    $lastId = $dbh->lastInsertId();
    echo json_encode(array("status" => "INSERTED", "id" => $lastId));

} catch (PDOException $e) {
    echo json_encode(array("status" => "ERROR", "message" => $e->getMessage()));
}

$dbh = null;
?>
