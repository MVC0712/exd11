<?php
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

    // Chỉ xử lý process_id = 4
    if ($_POST['process_id'] === "4") {
        $sql = "UPDATE t_press 
                SET qc_check_date = :date, qc_name_id = :qc_name_id 
                WHERE id = :press_id";

        $prepare = $dbh->prepare($sql);
        $prepare->bindValue(':press_id', (int)$_POST['press_id'], PDO::PARAM_INT);
        $prepare->bindValue(':date', $_POST['date'], PDO::PARAM_STR);
        $prepare->bindValue(':qc_name_id', (int)$_POST['qc_name_id'], PDO::PARAM_INT);
        $prepare->execute();

        echo json_encode("UPDATED");
    }

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$dbh = null;
