<?php
  /* 21/09/12 */
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
          COUNT(*) AS count
        FROM t_packing_box_number
        WHERE t_packing_box_number.m_ordersheet_id = :m_ordersheet_id
      ";

      $prepare = $dbh->prepare($sql);

      $prepare->bindValue(':m_ordersheet_id', $_POST["m_ordersheet_id"], PDO::PARAM_STR);
      $prepare->execute();
      $result = $prepare->fetch(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
