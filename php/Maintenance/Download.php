<?php
  $userid = "webuser";
  $passwd = "";
  
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
$sql="SELECT 
m_line.line,
m_machine.machine,
m_part_position.part_position,
CASE t_maintenance_history.normal
    WHEN 0 THEN 'Yes'
    ELSE 'No'
END AS Normal,
DATE_FORMAT(t10.maintenance_start, '%y-%m-%d') AS maintenance_start,
DATE_FORMAT(DATE_ADD(t10.maintenance_start,
INTERVAL m_part_position.duration DAY), '%y-%m-%d') AS next_maintenance,
DATEDIFF(CURRENT_DATE, t10.maintenance_start) AS TTN,
CASE
    WHEN
        m_part_position.duration > DATEDIFF(CURRENT_DATE,
                t_maintenance_history.maintenance_start)
    THEN
        'Chưa dến hạn'
    WHEN m_part_position.duration <= DATEDIFF(CURRENT_DATE, t10.maintenance_start) THEN 'Đã đến hạn'
END AS Ittime,
t_maintenance_history.note
FROM
t_maintenance_history
    LEFT JOIN
m_part_position ON t_maintenance_history.part_position_id = m_part_position.id
    LEFT JOIN
m_machine ON m_part_position.machine_id = m_machine.id
    LEFT JOIN
m_line ON t_maintenance_history.line_id = m_line.id
    LEFT JOIN
(SELECT 
    t_maintenance_history.part_position_id,
        MAX(t_maintenance_history.maintenance_start) AS maintenance_start
FROM
    t_maintenance_history
GROUP BY t_maintenance_history.part_position_id) AS t10 ON t_maintenance_history.part_position_id = t10.part_position_id
    AND t_maintenance_history.maintenance_start = t10.maintenance_start
WHERE
t10.part_position_id IS NOT NULL
GROUP BY t_maintenance_history.part_position_id
ORDER BY Ittime ASC , m_machine.machine ASC , next_maintenance ASC , t10.maintenance_start DESC;";

    $stmt = $dbh->query($sql);

    $filename = "excelfilename.xls";
    // header("Content-Type: application/xls");
    header('Content-Type: application/vnd.ms-excel');
    // header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    header("Content-Disposition: attachment; filename=$filename");  
    header("Content-Transfer-Encoding: binary");
    header("Pragma: no-cache"); 
    header("Expires: 0");
    $sep = "\t";
    
    // print("\n");    
    $flag = false;
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        if (!$flag) {
            echo implode("\t", array_keys($row)) . "\r\n";
            $flag = true;
        }
        echo implode("\t", array_values($row)) . "\r\n";
    }   

  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
?>