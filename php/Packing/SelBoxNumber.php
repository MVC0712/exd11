<?php
  /* 21/08/29作成 */
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
          t_packing_box_number.id,
          t_packing_box_number.box_number,
          'dummy',
          t_packing_box_number.created_at
        FROM t_packing_box_number
        ORDER BY created_at DESC, box_number
        WHERE t_packing_box_number.m_ordersheet_id = :m_ordersheet_id
      ";

      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':m_ordersheet_id', (INT)$_POST["m_ordersheet_id"], PDO::PARAM_INT);
      // $prepare->bindValue(':limit', (INT)$_POST["limit"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
