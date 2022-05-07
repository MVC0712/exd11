<?php
  $userid = "webuser";
  $passwd = "";

  $data = "";
  $press_id = "";

  $data = $_POST['data'];
  $press_id = $_POST['press_id'];
  $hardness_finish = $_POST['hardness_finish'];
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
            $sql_paramater[] = "('{$press_id}', '{$val[0]}', '{$val[2]}', '{$val[3]}', '{$val[4]}', '{$val[5]}', '{$val[6]}', '{$val[7]}', '{$val[8]}', '{$val[9]}', '{$val[10]}', '{$val[11]}')";
        };

      $sql = "INSERT INTO t_hardness ";
      $sql = $sql."(press_id, position, 1hn, 2hn, 3hn, 4hn, 5hn, 6hn, 7hn, 8hn, 9hn, 10hn) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
      // print_r($sql);
      $prepare = $dbh->prepare($sql);
      $prepare->execute();

      $sql1 = "INSERT INTO t_press_sub (press_id, hardness_finish) VALUES ('{$press_id}', '{$hardness_finish}')";
      $prepare = $dbh->prepare($sql1);
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
