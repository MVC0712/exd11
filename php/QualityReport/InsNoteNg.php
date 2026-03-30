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

    $sql = "INSERT INTO t_note_ng_quality (
        press_date, die_id, code, note, name_id
    ) VALUES (
        :press_date, :die_id, :code, :note, :name_id
    )";

    $prepare = $dbh->prepare($sql);
    $prepare->bindValue(":press_date", $_POST["press_date"], PDO::PARAM_STR);
    $prepare->bindValue(":die_id", (int)$_POST["dies_id"], PDO::PARAM_INT);
    $prepare->bindValue(":code", $_POST["code"], PDO::PARAM_STR);
    $prepare->bindValue(":note", $_POST["note"], PDO::PARAM_STR);
    $prepare->bindValue(":name_id", $_POST["name_id"], PDO::PARAM_STR);
    
    $prepare->execute();

    echo json_encode("INSERTED");
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$dbh = null;
?>