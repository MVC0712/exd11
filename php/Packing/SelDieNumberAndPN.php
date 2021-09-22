<?php
  /* 21/09/02作成 */
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
            m_dies.die_number, 
            m_production_numbers.production_number,
            m_production_numbers.id AS production_numbers_id
        FROM
            t_press
                LEFT JOIN
            m_dies ON t_press.dies_id = m_dies.id
                LEFT JOIN
            m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
        WHERE
            t_press.id = :t_press_id
      ";

      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':t_press_id', (INT)$_POST["t_press_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetch(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
