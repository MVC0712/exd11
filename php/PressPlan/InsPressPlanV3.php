<?php
  $userid = "webuser";
  $passwd = "";

  $data = "";
  $press_date_at = "";

  $data = $_POST['data'];
  $press_date_at = $_POST['press_date_at'];
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
        foreach ($data_json as $val) {
            $sql_paramater[] = "('{$val[0]}', '{$val[2]}', '{$val[3]}', '{$val[4]}', '{$val[5]}', '{$press_date_at}')";
        };

      $sql = "INSERT INTO t_press_plan ";
      $sql = $sql."(production_number_id, dies_id, ordinal, quantity, note, plan_date) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
