  <?php
  $userid = "webuser";
  $passwd = "";
  
  $press_date = "";
  $dies_id = "";
  $press_start_at = "";

  $press_date = $_POST['press_date'];
  $dies_id = $_POST['dies_id'];
  $press_start_at = $_POST['press_start_at'];

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

    $sql = "
    SELECT 
    t_press.actual_billet_quantities,
    m_pressing_type.pressing_type,
    t_press.id AS press_id,
    t_press.dimension_check_date,
    t_press.etching_check_date,
    t_press.aging_check_date,
    t_press.packing_check_date
  FROM
    t_press
  LEFT JOIN
    m_dies ON t_press.dies_id = m_dies.id
  LEFT JOIN
    m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
  WHERE
    t_press.press_date_at = '$press_date'
  AND m_dies.id = '$dies_id'
  AND t_press.press_start_at = '$press_start_at' ";
    $prepare = $dbh->prepare($sql);
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
} catch (PDOException $e) {
    $error = $e->getMessage();
    print_r($error);
}