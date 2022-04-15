<?php
    $userid = "webuser";
    $passwd = "";

    $machine_id = "";
    $part_position = "";
    $duration = "";

    $machine_id = $_POST['machine_id'];
    $part_position = $_POST['part_position'];
    $duration = $_POST['duration'];

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

    $sql = "INSERT INTO m_part_position (machine_id, part_position, duration) 
    VALUES ('$machine_id', '$part_position', '$duration')";
    $prepare = $dbh->prepare($sql);
    
    $prepare->execute();
    echo json_encode("INSERTED");
    } catch (PDOException $e) {
        $error = $e->getMessage();
        print_r($error);
    }
$dbh = null;
