<?php
$userid = "webuser";
$passwd = "";

// Nhận ngày bắt đầu và kết thúc
$start_date = $_POST['start-term-pull'] ?? '';
$end_date   = $_POST['end-term-pull'] ?? '';

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

  // Truy vấn cơ bản
  $sql = "
    SELECT 
      t_pull_press.id,
      t_pull_press.press_id,
      DATE_FORMAT(t_pull_press.pull_date, '%m-%d') AS pull_date,
      m_dies.die_number,
      t_press.dies_id,
      m_dies.production_number_id,
      m_production_numbers.production_number,
      t_pull_press.pull_no1,
      t_pull_press.pull_no2,
      TIME_FORMAT(t_pull_press.pull_start, '%H:%i') AS pull_start, 
      TIME_FORMAT(t_pull_press.pull_end, '%H:%i') AS pull_end
    FROM 
      t_pull_press
    LEFT JOIN 
      t_press ON t_pull_press.press_id = t_press.id
    LEFT JOIN
      m_dies ON t_press.dies_id = m_dies.id
    LEFT JOIN
      m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
    WHERE 1 = 1
  ";

  // Chỉ lọc nếu có ngày
  if (!empty($start_date)) {
    $sql .= " AND t_pull_press.pull_date >= :start_date";
  }
  if (!empty($end_date)) {
    $sql .= " AND t_pull_press.pull_date <= :end_date";
  }

  $sql .= " ORDER BY t_pull_press.pull_date DESC, t_pull_press.pull_start ASC";

  $stmt = $dbh->prepare($sql);

  if (!empty($start_date)) {
    $stmt->bindValue(':start_date', $start_date);
  }
  if (!empty($end_date)) {
    $stmt->bindValue(':end_date', $end_date);
  }

  $stmt->execute();
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($result);

} catch (PDOException $e) {
  echo json_encode(['error' => $e->getMessage()]);
}

$dbh = null;
?>
