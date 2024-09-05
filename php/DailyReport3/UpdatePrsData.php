<?php
  $userid = "webuser";
  $passwd = "";

  $press_id = $_POST['press_id'];
  $first_actual_length = $_POST['first_actual_length'];
  $cutting_staff_id = $_POST['cutting_staff_id'];
  $cutting_date = $_POST['cutting_date'];
  $cutting_start = $_POST['cutting_start'];
  $cutting_finish = $_POST['cutting_finish'];

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
  $sql="UPDATE t_press SET 
        first_actual_length = '$first_actual_length',
        cutting_staff_id = '$cutting_staff_id',
        cutting_date = '$cutting_date',
        cutting_start = '$cutting_start',
        cutting_finish = '$cutting_finish'
      WHERE id = $press_id ";
      
    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
