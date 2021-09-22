<?php
  /* 21/04/30作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  
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
 m_production_numbers.id,
 m_production_numbers_category1.name_jp AS category1,
 m_production_numbers_category2.name_jp AS category2,
 m_production_numbers.production_number,
 t1.count AS linked_dies,
 'dummy'
FROM m_production_numbers
LEFT JOIN m_production_numbers_category2 ON m_production_numbers.production_category2_id = m_production_numbers_category2.id
LEFT JOIN m_production_numbers_category1 ON m_production_numbers_category2.category1_id = m_production_numbers_category1.id
LEFT JOIN 
(
SELECT 
 m_dies.production_number_id, COUNT(m_dies.id) AS COUNT
FROM m_dies
GROUP BY m_dies.production_number_id
) AS t1 ON m_production_numbers.id = t1.production_number_id
WHERE m_production_numbers.production_number LIKE :production_number
ORDER BY m_production_numbers.production_number

    ");

    $prepare->bindValue(':production_number', $_POST["production_number"], PDO::PARAM_STR); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
