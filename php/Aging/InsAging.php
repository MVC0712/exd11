<?php
  /* 21/06/16作成 */
  $userid = "webuser";
  $passwd = "";

  $data = file_get_contents('php://input');//POSTされたjsonデータを受け取る
  $data_json = json_decode($data);
  // print_r($data_json);
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

      foreach ($data_json as $val) {
          if ($val[7] != '') {
              $sql_paramater[] = "({$val[0]}, '{$val[6]}', {$val[7]}, '{$val[8]}')";
          } else {
              $sql_paramater[] = "({$val[0]}, '{$val[6]}', Null, '{$val[8]}')";
          }
      }

      $sql = "INSERT INTO t_aging (
        using_aging_rack_id, aging_date, hardness, create_at
          ) VALUES ".join(",", $sql_paramater);

      // print_r($sql);
      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
