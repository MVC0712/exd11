<?php
$userid = "webuser";
$passwd = "";

$startDate = $_POST['start-term-ex'] ?? '';
$endDate = $_POST['end-term-ex'] ?? '';

try {
    $dbh = new PDO(
        'mysql:host=localhost;dbname=extrusion;charset=utf8mb4',
        $userid,
        $passwd,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    $sql = "
      SELECT 
        t_time_press.id,
        t_time_press.press_id,
        DATE_FORMAT(t_time_press.time_date, '%m-%d') AS time_date,
        m_dies.die_number,
        t_press.dies_id,
        m_dies.production_number_id,
        m_production_numbers.production_number,
        m_pressing_type.pressing_type,
        t_press.pressing_type_id,
        t_time_press.Code,
        TIME_FORMAT(MIN(t_time_press.time_start), '%H:%i') AS time_start, 
        TIME_FORMAT(MAX(t_time_press.time_end), '%H:%i') AS time_end,
        SUM(t_press_work_length_quantity.work_quantity) AS total_work_quantity,
        MAX(m_production_numbers.specific_weight) AS specific_weight,
        MAX(m_production_numbers.production_length) AS production_length,
        MAX(t_time_press.time_note) AS time_note
      FROM 
        t_time_press
      LEFT JOIN 
        t_press ON t_time_press.press_id = t_press.id
      LEFT JOIN
        m_dies ON t_press.dies_id = m_dies.id
      LEFT JOIN
        m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
      LEFT JOIN
        m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
      LEFT JOIN 
        t_press_work_length_quantity ON t_press.id = t_press_work_length_quantity.press_id
    ";

    $conditions = [];
    $params = [];

    if (!empty($startDate) && !empty($endDate)) {
        $startDateTime = DateTime::createFromFormat('Y-m-d', $startDate);
        $endDateTime = DateTime::createFromFormat('Y-m-d', $endDate);

        if ($startDateTime && $endDateTime && $startDateTime <= $endDateTime) {
            $conditions[] = "t_time_press.time_date BETWEEN :startDate AND :endDate";
            $params[':startDate'] = $startDate;
            $params[':endDate'] = $endDate;
        }
    }

    if (count($conditions) > 0) {
        $sql .= " WHERE " . implode(' AND ', $conditions);
    }

    $sql .= " GROUP BY t_time_press.id ";

    $sql .= " ORDER BY t_time_press.time_date DESC, MIN(t_time_press.time_start) ASC, t_time_press.Code DESC ";

    $stmt = $dbh->prepare($sql);
    $stmt->execute($params);

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$dbh = null;
?>
