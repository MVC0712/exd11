<?php
  /* 21/05/17作成 */
  $userid = "webuser";
  $passwd = "";

  $start = $_POST['start'];
  $end = $_POST['end'];
  // $machine_number = $_POST['machine_number'];
  
  try{
    $dbh = new PDO(
      'mysql:host=localhost; dbname=extrusion; charset=utf8',
      $userid,
      $passwd,
      array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
      )
    );

    $prepare = $dbh->prepare("SELECT 
    t_extrusion_log.id,
    input_date,
    machine_number,
    die_number,
    code,
    TIME_FORMAT(start, '%H:%i') AS start,
    TIME_FORMAT(end, '%H:%i') AS end,
    note
FROM
    t_extrusion_log
        LEFT JOIN
    m_dies ON m_dies.id = t_extrusion_log.die_id
        LEFT JOIN
    m_code ON m_code.id = t_extrusion_log.code_id
        WHERE
            t_extrusion_log.input_date BETWEEN '$start' AND '$end' 
        ORDER BY t_extrusion_log.input_date DESC, t_extrusion_log.start ASC, t_extrusion_log.end ASC
    ");
    $prepare->execute();
    $result = $prepare->fetchALL(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
