<?php
  /* 21/07/26作成 */
  $userid = "webuser";
  $passwd = "";
//   print_r($_POST);
  
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

      $prepare = $dbh->prepare("
      SELECT 
    rz1, die_mark_1, rz2, die_mark_2, rz3, die_mark_3, note
FROM
    m_measurement_data
        LEFT JOIN
    m_production_numbers ON m_production_numbers.id = m_measurement_data.production_number_id
        LEFT JOIN
    m_dies ON m_production_numbers.id = m_dies.production_number_id
  WHERE
      m_dies.id = :dies_id  
      ");

      $prepare->bindValue(':dies_id', (INT)$_POST["dies_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
