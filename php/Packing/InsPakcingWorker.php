<?php
  /* 21/08/31作成 */
  $userid = "webuser";
  $passwd = "";
//  $data_json = json_decode($data);
//  $data_json = array_values($data_json); //配列の並び替え
  // print_r($_POST);
  // print_r("<br>");
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

      $prepare = $dbh->prepare(
          "INSERT INTO t_packing_worker (
            t_packing_id,
            m_staff_id,
            created_at
              ) VALUES (
            :t_packing_id,
            :m_staff_id,
            :created_at
              )"
      );

      $prepare->bindValue(':t_packing_id', (INT)$_POST['t_packing_id'], PDO::PARAM_INT);
      $prepare->bindValue(':m_staff_id', (INT)$_POST['m_staff_id'], PDO::PARAM_INT);
      $prepare->bindValue(':created_at', $_POST['created_at'], PDO::PARAM_STR);
      // print_r($sql);
      $prepare->execute();

      
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
