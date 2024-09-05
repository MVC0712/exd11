<?php
  $userid = "webuser";
  $passwd = "";

  $id = $_POST['id'];
  $work_length = $_POST['work_length'];
  $roughness = getNull($_POST['roughness']);
  $die_mark = getNull($_POST['die_mark']);
  $staff_check_id = $_POST['staff_check_id'];
  $result = $_POST['result'];

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

  $sql="";
  $sql="UPDATE t_press_work_length_quantity SET 
        work_length = '$work_length',
        roughness = '$roughness',
        die_mark = '$die_mark',
        staff_check_id = '$staff_check_id',
        result = '$result'
      WHERE id = $id ";
      
    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;

  function getNull($num) {
    if (($num == 0) || ($num == "")) {
        return null;
    } else {
        return $num;
    }
  }