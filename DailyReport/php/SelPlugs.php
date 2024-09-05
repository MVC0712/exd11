<?php
    require_once('../../connection.php');
    $dbh = new DBHandler();
    if ($dbh->getInstance() === null) {
        die("No database connection");
    }
    $plug_number = $_POST['plug_number'];
    $ex_production_numbers_id = $_POST['ex_production_numbers_id'];
    try {
        $sql = "SELECT * FROM m_plugs WHERE plug_number LIKE '%$plug_number%' AND ex_production_numbers_id = '$ex_production_numbers_id'";
        $stmt = $dbh->getInstance()->prepare($sql);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } 
    catch(PDOException $e) {
        echo ($e->errorInfo[2]);
    }
?>