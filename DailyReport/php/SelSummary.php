<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}
$datetime = date("Y-m-d H:i:s");
try {
    $sql = "SELECT 
    tube_drawing.t_drawing.id,
    tube_drawing.t_drawing.production_date,
    tube_drawing.m_production_numbers.production_number,
    tube_drawing.t_drawing.production_time_start,
    tube_drawing.t_drawing.production_time_end,
    tube_drawing.m_dies.die_number,
    tube_drawing.m_plugs.plug_number
FROM
    tube_drawing.t_drawing
LEFT JOIN
    tube_drawing.m_production_numbers ON tube_drawing.m_production_numbers.id = tube_drawing.t_drawing.production_number_id
LEFT JOIN
    tube_drawing.m_dies ON tube_drawing.m_dies.id = tube_drawing.t_drawing.die_number_id
LEFT JOIN
    tube_drawing.m_plugs ON tube_drawing.m_plugs.id = tube_drawing.t_drawing.plug_number_id
ORDER BY production_date DESC";
    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo ($e->errorInfo[2]);
}
?>