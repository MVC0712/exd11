<?php
  /* 21/06/17作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);

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
      // 同じ t_using_agin_rack.aging_id を持つものがいくつあるか？
      $sql = "SELECT COUNT(*) AS count ,
          t_using_aging_rack.aging_id
          FROM t_using_aging_rack 
            WHERE t_using_aging_rack.aging_id = 
              (
                SELECT t_using_aging_rack.aging_id 
                FROM t_using_aging_rack 
                WHERE t_using_aging_rack.id = :id
              )";
      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':id', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetch(PDO::FETCH_ASSOC);
      // print_r($result['count']);
      // print_r($result['aging_id']);
      $count = $result['count'];
      $aging_id = $result['aging_id'];

      $sql = "UPDATE t_using_aging_rack
          SET aging_id = NULL
          WHERE id = :id";
      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':id', (INT)$_POST["id"], PDO::PARAM_INT);
      $prepare->execute();

      if ($count == 1) {
          // $result['count] が 1 なので、t_agingからも値を消す。
          // そうしないと、処理したラックがないのにデータがt_agingに残ってしまう
          // print_r("t_agingも削除必要");
          $sql = "DELETE FROM t_aging WHERE id = :id";
          $prepare = $dbh->prepare($sql);
          $prepare->bindValue(':id', (INT)$aging_id, PDO::PARAM_INT);
          $prepare->execute();
      }

      echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
