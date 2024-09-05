<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}
$material_name_id = "";
$material_name_id = $_POST['material_name_id'];
$datetime = date("Y-m-d H:i:s");
try {
    $sql = "SELECT 
    id, material_name_type
    FROM
        m_material_name_type
    WHERE
        material_name_id = '$material_name_id';)";
    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo $e;
}
?>