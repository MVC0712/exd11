<?php
  $userid = "webuser";
  $passwd = "";
  
  $press_date = "";
  $dies_id = "";

  $press_date = $_POST['press_date'];
  $dies_id = $_POST['dies_id'];

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
      t_press.press_start_at,
      TIME_FORMAT(t_press.press_start_at, '%H:%i') AS press_start_hm
    FROM
      t_press
    WHERE
      t_press.press_date_at = '$press_date' AND t_press.dies_id = '$dies_id' ";
    $prepare = $dbh->prepare($sql);
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
} catch (PDOException $e) {
    $error = $e->getMessage();
    print_r($error);
}