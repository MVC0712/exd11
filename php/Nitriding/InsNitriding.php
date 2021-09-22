<?php
  /* 21/06/24作成 */
  $userid = "webuser";
  $passwd = "";
  $nitriding_date = "";
  // $_POSTの末尾には窒化日が入っている　array_popすると、配列を変換しているとエラーが出る

  // print_r($nitriding_date);
  $nitriding_date = $_POST['nitriding_date'];
  array_pop($_POST);

  $today = date("Y-m-d");

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


      // INSERT するための配列の準備
      foreach ($_POST as $val) {
          // print_r($val);
          // echo "<br>";
          $sql_paramater[] = "({$val}, '$nitriding_date', '$today')";
      }
      //   print_r($sql_paramater);
      $sql = "INSERT INTO t_nitriding ";
      $sql = $sql."(dies_id, nitriding_date_at, created_at) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
      // echo "<br>";
    //   print_r($sql);
      // echo "<br>";

      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
