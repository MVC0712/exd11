<?php
  /* 21/08/29作成 */
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
          "INSERT INTO t_packing_box (
            packing_id,
            box_number_id,
            using_aging_rack_id,
            work_quantity,
            created_at
              ) VALUES (
            :packing_id,
            :box_number_id,
            :using_aging_rack_id,
            :work_quantity,
            :created_at
              )"
      );

      $prepare->bindValue(':packing_id', (INT)$_POST['packing_id'], PDO::PARAM_INT);
      $prepare->bindValue(':box_number_id', (INT)$_POST['box_number_id'], PDO::PARAM_INT);
      $prepare->bindValue(':using_aging_rack_id', (INT)$_POST['using_aging_rack_id'], PDO::PARAM_INT);
      $prepare->bindValue(':work_quantity', (INT)$_POST['work_quantity'], PDO::PARAM_INT);
      $prepare->bindValue(':created_at', $_POST['created_at'], PDO::PARAM_STR);
      // print_r($sql);
      $prepare->execute();

      
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
