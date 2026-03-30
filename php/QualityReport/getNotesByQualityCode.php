<?php
$userid = "webuser";
$passwd = "";

try {
    $dbh = new PDO(
        'mysql:host=localhost;dbname=extrusion;charset=utf8',
        $userid,
        $passwd,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    $quality_code = isset($_POST['quality_code']) ? $_POST['quality_code'] : '';
    $press_id = isset($_POST['press_id']) ? (int)$_POST['press_id'] : 0;

    $sql = "
        SELECT t_press_quality.note
        FROM t_using_aging_rack
        LEFT JOIN t_press_quality ON t_press_quality.using_aging_rack_id = t_using_aging_rack.id
        LEFT JOIN m_quality_code ON t_press_quality.quality_code_id = m_quality_code.id
        WHERE t_using_aging_rack.t_press_id = :press_id
        AND m_quality_code.quality_code = :quality_code
    ";

    $stmt = $dbh->prepare($sql);
    $stmt->bindValue(':press_id', $press_id, PDO::PARAM_INT);
    $stmt->bindValue(':quality_code', $quality_code, PDO::PARAM_STR);
    $stmt->execute();

    $notes = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($notes);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
  $dbh = null;
