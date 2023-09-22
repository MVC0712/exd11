<?php
  $userid = "webuser";
  $passwd = "";

  $press_id = $_POST['press_id'];
  $etching_finish = $_POST['etching_finish'];
  $etching_staff = $_POST['etching_staff'];
  $etching_check_staff = $_POST['etching_check_staff'];
  $file_url = $_POST['file_url'];
  $image_url = $_POST['image_url'];
  $etching_note = $_POST['etching_note'];

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
  $sql="UPDATE t_press_sub SET 
        etching_finish = '$etching_finish',
        etching_staff = '$etching_staff',
        etching_check_staff = '$etching_check_staff',
        etching_file_url = '$file_url',
        etching_image_url = '$image_url',
        etching_note = '$etching_note'
      WHERE press_id = $press_id ";
// print_r($sql);
    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;