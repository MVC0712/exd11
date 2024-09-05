<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}
$product_type = "";
$product_type = $_POST['product_type'];
$datetime = date("Y-m-d H:i:s");
try {
    $sql = "SELECT 
    *
    FROM
        billet_casting.m_material_element
    WHERE
        material_type = '$product_type';)";
    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo $e;
}
?>