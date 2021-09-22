<?php
  /* 21/08/24作成 */
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

      $sql = "
        SELECT 
          t_press.id,
          DATE_FORMAT(t_press.press_date_at, '%m-%d') AS press_date_at
        FROM t_press
        LEFT JOIN m_ordersheet ON t_press.ordersheet_id = m_ordersheet.id
        WHERE m_ordersheet.id = :m_ordersheet_id
        ORDER BY t_press.press_date_at DESC
      ";

      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':m_ordersheet_id', $_POST["m_ordersheet_id"], PDO::PARAM_STR);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
