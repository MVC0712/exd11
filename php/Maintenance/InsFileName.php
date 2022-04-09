<?php
  $userid = "webuser";
  $passwd = "";

  $t_maintenance_history_id = "";
  $t_maintenance_history_id = $_POST['t_maintenance_history_id'];
  array_pop($_POST);

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

          $sql_paramater[] = "({$val}, '$t_maintenance_history_id')";
      }

      $sql = "INSERT INTO t_machine_maintenance_attached_file ";
      $sql = $sql."(attached_file, t_maintenance_history_id) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
    //   $prepare = $dbh->prepare($sql);
      print_r($sql);
    //   $prepare->execute();
    //   echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;