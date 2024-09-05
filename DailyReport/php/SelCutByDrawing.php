<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}
$drawing_id = $_POST['drawing_id'];
try {
    $sql = "SELECT order_number, rack_number, ok_quantity, ng_quantity 
    FROM tube_drawing.t_profile_cut 
    WHERE tube_drawing.t_profile_cut.drawing_id = '$drawing_id'
    ORDER BY order_number ASC";
    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo $e;
}
?>