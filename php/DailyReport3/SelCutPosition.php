<?php
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

      $prepare = $dbh->prepare("SELECT 
            h,
            a,
            b,
            c,
            d,
            e,
            f,
            end,
            ROUND(production_length * 1000, 0) AS production_length
        FROM
            extrusion.m_production_numbers_sub
                LEFT JOIN
            m_dies ON m_dies.production_number_id = m_production_numbers_sub.production_number_id
                LEFT JOIN
            m_production_numbers ON m_production_numbers.id = m_production_numbers_sub.production_number_id
                LEFT JOIN
            t_press ON t_press.dies_id = m_dies.id
        WHERE
          t_press.id = :press_id ;
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
