<?php
  /* 21/06/20作成 */
  $userid = "webuser";
  $passwd = "";

  $data = file_get_contents('php://input');//POSTされたjsonデータを受け取る
  $data_json = json_decode($data);
  $target_id = array_pop($data_json); // 配列の一番後ろにt_press.idが有るので取得
//   print_r($target_id);
// データが配列で渡されてくるので、$data_jsonにいれる
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
      // 予め、同じpress_idのデータを削除しておく
      $sql = "DELETE FROM t_press_work_length_quantity ";
      $sql = $sql."WHERE t_press_work_length_quantity.press_id = :id";
      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':id', (INT)$target_id, PDO::PARAM_INT);
      $prepare->execute();

      // INSERT するための配列の準備
      foreach ($data_json as $val) {
          if ($val[2] != "" || $val[3] != "") { // どちらかに必ず値がある事
              if ($val[2] == "") {
                  $val[2] = "null";
              }
              if ($val[3] == "") {
                  $val[3] = "null";
              }
              $sql_paramater[] = "({$target_id}, {$val[0]}, {$val[1]}, {$val[2]}, {$val[3]})";
          }
      }
      //   print_r($sql_paramater);
      $sql = "INSERT INTO t_press_work_length_quantity ";
      $sql = $sql."(press_id, billet_number, work_number, work_length, work_quantity) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
