<?php
    $userid = "webuser";
    $passwd = "";

    $maintenance_start = "";
    $maintenance_finish = "";
    $note = "";
    $line = "";
    $machine = "";
    $part_position = "";
    $file_url = "";

    $maintenance_start = $_POST['maintenance_start'];
    $maintenance_finish = $_POST['maintenance_finish'];
    $note = $_POST['note'];
    $line = $_POST['line'];
    $machine = $_POST['machine'];
    $part_position = $_POST['part_position'];
    $file_url = $_POST['file_url'];

    try {
        $dbh = new PDO(
            'mysql:host=localhost; dbname=exd_maintenance; charset=utf8',
            $userid,
            $passwd,
            array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
            )
        );

    $sql = "INSERT INTO t_maintenance_history (line_id, part_position_id, maintenance_start, maintenance_finish, note, file_url
    ) VALUES (
        '$line', '$part_position', '$maintenance_start', '$maintenance_finish', '$note', '$file_url'
    )";
    $prepare = $dbh->prepare($sql);
    
    $prepare->execute();
    echo json_encode("INSERTED");
    } catch (PDOException $e) {
        $error = $e->getMessage();
        print_r($error);
    }
$dbh = null;
