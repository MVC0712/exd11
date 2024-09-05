<?php
  $userid = "webuser";
  $passwd = "";

  $data = "";
  $press_id = "";

  $data = $_POST['data'];
  $press_id = $_POST['press_id'];
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
            $sql_paramater[] = "('{$press_id}', '{$val[0]}', '{$val[2]}', '{$val[3]}', '{$val[4]}', '{$val[5]}', '{$val[6]}', '{$val[7]}', '{$val[8]}')";
        };

      $sql = "INSERT INTO t_measurement ";
      $sql = $sql."(press_id, position, rz1, die_mark_1, rz2, die_mark_2, rz3, die_mark_3, note) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
