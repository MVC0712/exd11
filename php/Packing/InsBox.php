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
          "INSERT INTO t_press_quality (
            press_id,
            process_id,
            quality_code_id,
            ng_quantities,
            created_at
              ) VALUES (
            :press_id,
            :process_id,
            :quality_code_id,
            :ng_quantities,
            :created_at
              )"
      );

      $prepare->bindValue(':press_id', (INT)$_POST['press_id'], PDO::PARAM_INT);
      $prepare->bindValue(':process_id', (INT)$_POST['process_id'], PDO::PARAM_INT);
      $prepare->bindValue(':quality_code_id', (INT)$_POST['quality_code_id'], PDO::PARAM_INT);
      $prepare->bindValue(':ng_quantities', (INT)$_POST['ng_quantities'], PDO::PARAM_INT);
      $prepare->bindValue(':created_at', $_POST['today'], PDO::PARAM_STR);
      // print_r($sql);
      $prepare->execute();

      
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
