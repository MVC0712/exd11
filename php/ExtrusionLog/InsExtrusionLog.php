<?php
  $userid = "webuser";
  $passwd = "";

  $data = $_POST['data'];
  $input_date = $_POST['input_date'];
  $machine_number = $_POST['machine_number'];
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
            $sql_paramater[] = "('{$input_date}', '{$machine_number}', '{$val[1]}', '{$val[2]}', '{$val[3]}', '{$val[4]}', '{$val[5]}')";
        };

      $sql = "INSERT INTO t_extrusion_log ";
      $sql = $sql."(input_date, machine_number, die_id, code_id, start, end, note) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
      // print_r($sql);
      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
