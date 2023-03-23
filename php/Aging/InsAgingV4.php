<?php
  /* 21/06/16作成 */
  // 1: t_aging に aging_date, hardness, create_at の値をinsert
  // 2; 1のid値を取得
  // 3: t_using_aging_rackの選択したidに2の値をupdate
  $userid = "webuser";
  $passwd = "";

  $aging_date = $_POST['aging_date'];
  $start_at = $_POST['start_at'];
  $hardness = $_POST['hardness'];
  $aging_type = $_POST['aging_type'];
  $created_at = $_POST['created_at'];
  array_pop($_POST);
  array_pop($_POST);
  array_pop($_POST);
  array_pop($_POST);
  array_pop($_POST);

  $where_strings = "(";

  foreach ($_POST as $val) {
      $where_strings = $where_strings.$val.",";
  }
  $where_strings = substr($where_strings, 0, -1).")";

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

      $sql = "INSERT INTO t_aging (aging_date, hardness, start_at, aging_type, create_at) 
        VALUES ('$aging_date', '$hardness', '$start_at', '$aging_type', '$created_at')";
      $prepare = $dbh->prepare($sql);
      $prepare->execute();

      $sql = "SELECT MAX(t_aging.id) AS id FROM t_aging";
      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      $result = $prepare->fetch(PDO::FETCH_ASSOC);

      $sql = "UPDATE t_using_aging_rack SET aging_id =".$result['id']." WHERE id IN ".$where_strings;
      $prepare = $dbh->prepare($sql);
      $prepare->execute();

      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
