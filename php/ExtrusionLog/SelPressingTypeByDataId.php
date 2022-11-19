<?php
  $userid = "webuser";
  $passwd = "";

  $input_date = $_POST["input_date"];
  $dies_id = $_POST["dies_id"];
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

    $prepare = $dbh->prepare("
    SELECT 
    pressing_type_id, pressing_type
FROM
    t_press_directive
        LEFT JOIN
    m_pressing_type ON m_pressing_type.id = t_press_directive.pressing_type_id
WHERE
    t_press_directive.plan_date_at = '$input_date'
        AND dies_id = '$dies_id'
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
