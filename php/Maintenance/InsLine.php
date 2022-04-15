<?php
    $userid = "webuser";
    $passwd = "";

    $line = "";

    $line = $_POST['line'];

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

    $sql = "INSERT INTO m_line (line) VALUES ('$line')";
    $prepare = $dbh->prepare($sql);
    
    $prepare->execute();
    echo json_encode("INSERTED");
    } catch (PDOException $e) {
        $error = $e->getMessage();
        print_r($error);
    }
$dbh = null;
