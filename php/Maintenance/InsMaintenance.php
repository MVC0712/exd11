<?php
    $userid = "webuser";
    $passwd = "";

    $maintenance_start = "";
    $maintenance_finish = "";
    $note = "";
    $file_url = "";

    $maintenance_start = $_POST['maintenance_start'];
    $maintenance_finish = $_POST['maintenance_finish'];
    $note = $_POST['note'];
    $file_url = $_POST['file_url'];

    array_pop($_POST);
    array_pop($_POST);
    array_pop($_POST);
    array_pop($_POST);

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

    foreach ($_POST as $val) {
        $sql_paramater[] = "({$val}, '$maintenance_start', '$maintenance_finish', '$note', '$file_url')";
    }

    $sql = "INSERT INTO t_maintenance_history ";
    $sql = $sql."(part_position_id, maintenance_start, maintenance_finish, note, file_url) VALUES ";
    $sql = $sql.join(",", $sql_paramater);
    $prepare = $dbh->prepare($sql);
    
    $prepare->execute();
    echo json_encode("INSERTED");
    } catch (PDOException $e) {
        $error = $e->getMessage();
        print_r($error);
    }
$dbh = null;
