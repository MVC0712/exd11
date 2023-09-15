<?php
  /* 21/05/17作成 */
  $userid = "webuser";
  $passwd = "";

  $start = $_POST['start'];
  $end = $_POST['end'];
  $prs_type_search = $_POST['prs_type_search'];
  $mcn_type_search = $_POST['mcn_type_search'];
  $code_filter = $_POST['code_filter'];
  if ($prs_type_search == 0) {
    $add = "";
  } else {
    $add = " AND m_pressing_type.id LIKE '$prs_type_search'";
  };
  if ($mcn_type_search == 0) {
    $add2 = "";
  } else {
    $add2 = " AND machine_number LIKE '$mcn_type_search'";
  };
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
    $sql = "SELECT 
    t_extrusion_log.id,
    input_date,
    machine_number,
    die_number,
    m_pressing_type.pressing_type,
    code,
    TIME_FORMAT(start, '%H:%i') AS start,
    TIME_FORMAT(end, '%H:%i') AS end,
    ROUND(TIME_TO_SEC(timediff(end ,start))/60) AS diff,
    note
    FROM
    t_extrusion_log
        LEFT JOIN
    m_dies ON m_dies.id = t_extrusion_log.die_id
        LEFT JOIN
    m_code ON m_code.id = t_extrusion_log.code_id
        LEFT JOIN
    m_pressing_type ON m_pressing_type.id = t_extrusion_log.pressing_type_id
        WHERE
        code LIKE '%$code_filter%' AND t_extrusion_log.input_date BETWEEN '$start' AND '$end' $add $add2
        ORDER BY t_extrusion_log.input_date DESC, t_extrusion_log.start ASC, t_extrusion_log.end ASC";
    // print_r($sql);

    $prepare = $dbh->prepare($sql);
    $prepare->execute();
    $result = $prepare->fetchALL(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
