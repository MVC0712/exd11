<?php
  $userid = "webuser";
  $passwd = "";

  $data = $_POST['data'];
  $aging_date = $_POST['aging_date'];
  $start_at = $_POST['start_at'];
  $hardness = $_POST['hardness'];
  $aging_type = $_POST['aging_type'];
  $created_at = $_POST['created_at'];
  $data_json = json_decode($data);

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
      foreach ($data_json as $val) {
        $sql = "";
        $sql = "UPDATE t_using_aging_rack SET aging_id =".$result['id']. ", note ='".$val[5]."' WHERE id = ".$val[0];
        $prepare = $dbh->prepare($sql);
        $prepare->execute();
      }

      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
