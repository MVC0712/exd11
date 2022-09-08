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
            t_press.id AS press_id,
            t_press.dimension_check_date,
            t_press.etching_check_date,
            t_press.aging_check_date,
            t_press.packing_check_date,
            t_press.measurement_check_date
        FROM t_press
        left join m_dies on t_press.dies_id = m_dies.id
        left join m_pressing_type on t_press.pressing_type_id = m_pressing_type.id
        where t_press.press_date_at = :press_date and m_dies.id = :dies_id  
      ");

      $prepare->bindValue(':press_date', $_POST["press_date"], PDO::PARAM_STR);
      $prepare->bindValue(':dies_id', (INT)$_POST["dies_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
