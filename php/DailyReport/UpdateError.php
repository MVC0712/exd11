<?php
  $userid = "webuser";
  $passwd = "";

  $error_code_id = "";
  $start_time = "";
  $end_time = "";
  $note = "";
  $id = "";

  $error_code_id = $_POST['error_code_id'];
  $start_time = $_POST['start_time'];
  $end_time = $_POST['end_time'];
  $note = $_POST['note'];
  $id = $_POST['id'];

  try{
    $dbh = new PDO(
      'mysql:host=localhost; dbname=extrusion; charset=utf8',
      $userid,
      $passwd,
      array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
      )
    );

    $sql = "UPDATE t_error
              SET 
                error_code_id = '$error_code_id',
                start_time = '$start_time',
                end_time = '$end_time',
                note = '$note'
              WHERE t_error.id = $id
    ";
    $prepare = $dbh->prepare($sql);
    $prepare->execute();
    // print_r($sql);

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
