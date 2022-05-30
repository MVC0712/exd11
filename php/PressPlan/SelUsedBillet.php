<?php
  /* 21/06/22作成 */
  $userid = "webuser";
  $passwd = "";
  $start = "";
  $end = "";

  $start = $_POST['start'];
  $end = $_POST['end'];
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
      t_press.id,
      SUM(CASE
          WHEN
              billet_size = 9 AND billet_length = 1200
                  AND m_billet_material.billet_material = 'A6063'
          THEN
              t_press.actual_billet_quantities
          ELSE 0
      END) AS 'A60632281200',
      SUM(CASE
          WHEN
              billet_size = 9 AND billet_length = 600
                  AND m_billet_material.billet_material = 'A6063'
          THEN
              t_press.actual_billet_quantities
          ELSE 0
      END) AS 'A6063228600',
      SUM(CASE
          WHEN
              billet_size = 9 AND billet_length = 1200
                  AND m_billet_material.billet_material = 'A6061'
          THEN
              t_press.actual_billet_quantities
          ELSE 0
      END) AS 'A60612281200',
      SUM(CASE
          WHEN
              billet_size = 9 AND billet_length = 600
                  AND m_billet_material.billet_material = 'A6061'
          THEN
              t_press.actual_billet_quantities
          ELSE 0
      END) AS 'A6061228600',
      SUM(CASE
          WHEN
              billet_size = 9 AND billet_length = 1200
                  AND m_billet_material.billet_material = '6N01A'
          THEN
              t_press.actual_billet_quantities
          ELSE 0
      END) AS 'A6N01A2281200',
      SUM(CASE
          WHEN
              billet_size = 9 AND billet_length = 600
                  AND m_billet_material.billet_material = '6N01A'
          THEN
              t_press.actual_billet_quantities
          ELSE 0
      END) AS 'A6N01A228600'
  FROM
      t_press
          LEFT JOIN
      m_dies ON m_dies.id = t_press.dies_id
          LEFT JOIN
      m_production_numbers ON m_production_numbers.id = m_dies.production_number_id
          LEFT JOIN
      m_billet_material ON m_billet_material.id = m_production_numbers.billet_material_id
  WHERE
      t_press.press_date_at BETWEEN '$start' AND '$end'
  ORDER BY id DESC
  ;
        ";

      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
