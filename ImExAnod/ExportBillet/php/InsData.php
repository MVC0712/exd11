<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}
  $data = "";
  $export_date = "";

  $data = $_POST['data'];
  $export_date = $_POST['export_date'];
  $data_json = json_decode($data);

try {
    foreach ($data_json as $val) {
        $sql_paramater[] = "('{$val[0]}', '{$val[3]}', '{$export_date}')";
    };
    $sql = "INSERT INTO t_export ";
    $sql = $sql."(import_id, note, export_date) VALUES ";
    $sql = $sql.join(",", $sql_paramater);

    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo $e;
}
?>