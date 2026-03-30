<?php
$userid = "webuser";
$passwd = "";

$data = file_get_contents('php://input');
$timeData = json_decode($data, true); // true để có array

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

    if(count($timeData) > 0){
        $sql_values = [];
        foreach($timeData as $val){
            // $val[0] = maintenance_record_id
            // $val[1] = time_date, $val[2] = time_start, $val[3] = time_end, $val[4] = time_note
            $sql_values[] = "('{$val[0]}', '{$val[2]}', '{$val[3]}', '{$val[4]}', '{$val[5]}')";
        }

        $sql = "INSERT INTO t_maintenance_time (maintenance_record_id, time_date, time_start, time_end, time_note) VALUES " . join(",", $sql_values);
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
    }

    echo json_encode(['status' => 'INSERTED']);

} catch (PDOException $e) {
    echo json_encode(['status' => 'ERROR', 'message' => $e->getMessage()]);
}

$dbh = null;
?>
