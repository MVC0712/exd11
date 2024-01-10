<?php
  $userid = "webuser";
  $passwd = "";
  $production_number = $_POST["production_number"];
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
    m_production_numbers_sub.id,
    production_number,
    h,
    a,
    b,
    c,
    d,
    e,
    f,
    i,
    k,
    end
FROM
    m_production_numbers_sub
        LEFT JOIN
    m_production_numbers ON m_production_numbers.id = m_production_numbers_sub.production_number_id
WHERE
m_production_numbers.production_number LIKE '%$production_number%'
ORDER BY production_number ASC
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
