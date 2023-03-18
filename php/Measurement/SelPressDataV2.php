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
      t_press.actual_billet_quantities,
      m_pressing_type.pressing_type,
      t_press.measurement_check_date,
      t_press.etching_check_date,
      t_press.measurement_staff,
      t_press.packing_check_date,
      t_press.hardness_check_date
  FROM
      t_press
          LEFT JOIN
      m_dies ON t_press.dies_id = m_dies.id
          LEFT JOIN
      m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
  WHERE
      t_press.id = :press_id
      ");

      $prepare->bindValue(':press_id', (INT)$_POST["press_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
