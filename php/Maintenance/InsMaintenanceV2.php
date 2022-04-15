<?php
    $userid = "webuser";
    $passwd = "";

    $maintenance_start = "";
    $note = "";
    $normal = "";
    $staff = "";
    $line = "";
    $machine = "";

    $maintenance_start = $_POST['maintenance_start'];
    $note = $_POST['note'];
    $normal = $_POST['normal'];
    $staff = $_POST['staff'];
    $line = $_POST['line'];
    $machine = $_POST['machine'];
    array_pop($_POST);
    array_pop($_POST);
    array_pop($_POST);
    array_pop($_POST);
    array_pop($_POST);
    array_pop($_POST);

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

        foreach ($_POST as $val) {

            $sql_paramater[] = "('$normal', '$line', '{$val}', '$staff', '$maintenance_start', '$note')";
        }
  
        $sql = "INSERT INTO t_maintenance_history ";
        $sql = $sql."(normal, line_id, part_position_id, staff_id, maintenance_start, note) VALUES ";
        $sql = $sql.join(",", $sql_paramater);
        // print_r($sql);
        $prepare = $dbh->prepare($sql);
    
        $prepare->execute();

    $prepare = $dbh->prepare("
    SELECT MAX(t_maintenance_history.id) AS id FROM t_maintenance_history");
    $prepare->execute();
    $result = $prepare->fetch(PDO::FETCH_ASSOC);

    echo json_encode($result);
    } catch (PDOException $e) {
        $error = $e->getMessage();
        print_r($error);
    }
$dbh = null;
