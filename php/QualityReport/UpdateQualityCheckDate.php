<?php
  /* 21/08/04作成 */
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

      switch ($_POST['process_id']) {
        case "1":
          $sql = "UPDATE t_press SET dimension_check_date = :date WHERE id = :press_id";
          // echo "case 1";
          break;
        case "2":
          $sql = "UPDATE t_press SET etching_check_date = :date WHERE id = :press_id";
          // echo "case 2";
          break;
        case "3":
          $sql = "UPDATE t_press SET aging_check_date = :date WHERE id = :press_id";
          // echo "case 2";
          break;
        case "4":
          $sql = "UPDATE t_press SET packing_check_date = :date WHERE id = :press_id";
          // echo "case 2";
          break;
      }
      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':press_id', (INT)$_POST['press_id'], PDO::PARAM_INT);
      $prepare->bindValue(':date', $_POST['date'], PDO::PARAM_STR);
      $prepare->execute();
      echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
