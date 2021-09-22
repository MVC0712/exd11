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
          "INSERT INTO t_packing (
            m_ordersheet_id,
            packing_date,
            packing_start,
            packing_end,
            created_at
              ) VALUES (
            :m_ordersheet_id,
            :packing_date,
            :packing_start,
            :packing_end,
            :created_at
              )"
      );

      $prepare->bindValue(':m_ordersheet_id', $_POST['m_ordersheet_id'], PDO::PARAM_STR);
      $prepare->bindValue(':packing_date', $_POST['packing_date'], PDO::PARAM_STR);
      $prepare->bindValue(':packing_start', $_POST['packing_start'], PDO::PARAM_STR);
      $prepare->bindValue(':packing_end', $_POST['packing_end'], PDO::PARAM_STR);
      $prepare->bindValue(':created_at', $_POST['created_at'], PDO::PARAM_STR);
      // print_r($sql);
      $prepare->execute();

      
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
