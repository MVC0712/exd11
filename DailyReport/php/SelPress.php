<?php
    require_once('../../connection.php');
    $dbh = new DBHandler();
    if ($dbh->getInstance() === null) {
        die("No database connection");
    }
    $press_date = $_POST['press_date'];
    $production_number_id = $_POST['production_number_id'];
    try {
        $sql = "SELECT 
        extrusion.t_press.id,
        CONCAT(extrusion.m_dies.die_number,
                '-',
                extrusion.t_press.press_start_at) AS die_number
    FROM
        extrusion.t_press
            LEFT JOIN
        extrusion.m_dies ON extrusion.m_dies.id = extrusion.t_press.dies_id
    WHERE
        extrusion.t_press.press_date_at = '$press_date' 
        AND extrusion.m_dies.production_number_id = '$production_number_id'";
        $stmt = $dbh->getInstance()->prepare($sql);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } 
    catch(PDOException $e) {
        echo $e;
    }
?>