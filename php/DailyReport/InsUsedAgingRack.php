<?php
  /* 21/07/03修正 */
  $userid = "webuser";
  $passwd = "";
  
  $data = file_get_contents('php://input');//POSTされたjsonデータを受け取る
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

      $sql = "
      SELECT MAX(t_press.id) AS t_press_id FROM t_press
    ";
      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      $press_id = $prepare->fetch(PDO::FETCH_ASSOC);

      foreach ($data_json as $val) {
          $sql_paramater[] = "({$press_id['t_press_id']}, {$val[0]}, {$val[1]}, {$val[2]})";
      }
      $sql = "INSERT INTO t_using_aging_rack (t_press_id, order_number, rack_number, work_quantity) VALUES ".join(",", $sql_paramater);
      $prepare = $dbh->prepare($sql);
      $prepare->execute();

      echo json_encode("finished");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
