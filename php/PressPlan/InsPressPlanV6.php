<?php
  $userid = "webuser";
  $passwd = "";

  $data = "";
  $press_date_at = "";

  $data = $_POST['data'];
  $press_date_at = $_POST['press_date_at'];
  $press_machine = $_POST['press_machine'];
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
            $sql_paramater[] = "('{$val[0]}', '{$val[2]}', '{$val[3]}', '{$val[4]}', '{$val[5]}', '{$val[6]}', '{$val[7]}', '{$press_date_at}', '{$press_machine}')";
        };

      $sql = "INSERT INTO t_press_plan ";
      $sql = $sql."(production_number_id, dies_id, shift_id, ordinal, quantity, nitride_use, note, plan_date, press_machine) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
