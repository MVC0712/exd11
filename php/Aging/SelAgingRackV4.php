<?php
  /* 21/06/16作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  $die_number = $_POST["die_number"];
  $press_date = $_POST["press_date"];
    if ($press_date == "") {
        $add = "";
    } else {
        $add = " AND t_press.press_date_at LIKE '$press_date'";
    };
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
            t_using_aging_rack.id,
            m_dies.die_number,
            t_using_aging_rack.rack_number,
            DATE_FORMAT(t_press.press_date_at, '%y-%m-%d') AS press_date_at,
            '',
            ''
        FROM t_using_aging_rack
        LEFT JOIN t_press ON t_using_aging_rack.t_press_id = t_press.id
        LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
        WHERE t_using_aging_rack.aging_id IS NULL AND m_dies.die_number LIKE '%$die_number%' $add
        ORDER BY t_press.press_date_at DESC, m_dies.die_number
              ";

      $prepare = $dbh->prepare($sql);

      // $prepare->bindValue(':id', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
