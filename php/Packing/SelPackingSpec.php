<?php
  /* 21/09/05 */
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

      $sql = "
        SELECT 
          m_production_numbers.packing_quantity,
          m_production_numbers.packing_column,
          m_production_numbers.packing_row
        FROM m_production_numbers
        WHERE m_production_numbers.id = :production_number_id
      ";

      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':production_number_id', (INT)$_POST["production_number_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetch(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
