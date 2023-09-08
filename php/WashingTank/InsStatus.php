<?php
  $userid = "webuser";
  $passwd = "";
  $die_status_id = "";
  $do_sth_at = "";
  $note = "";
  $staff = "";
  $file_url = "";

  $die_status_id = $_POST['die_status_id'];
  $do_sth_at = $_POST['do_sth_at'];
  $note = $_POST['note'];
  $staff = $_POST['staff'];
  $tank = $_POST['tank'];
  $file_url = $_POST['file_url'];
  array_pop($_POST);
  array_pop($_POST);
  array_pop($_POST);
  array_pop($_POST);
  array_pop($_POST);
  array_pop($_POST);
  $today = date("Y-m-d");

    if ($tank == 0) {
        $tank = null;
    }

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

      foreach ($_POST as $val) {

          $sql_paramater[] = "({$val}, '$die_status_id', '$staff', '$do_sth_at', '$note', '$file_url', '$tank', '$today')";
      }

      $sql = "INSERT INTO t_dies_status ";
      $sql = $sql."(dies_id, die_status_id, staff_id, do_sth_at, note, file_url, tank, created_at) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
