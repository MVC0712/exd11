<?php
  $userid = "webuser";
  $passwd = "";

  $id = "";
  $jug1 = "";
  $code1 = "";
  $jug2 = "";
  $code2 = "";
  $jug3 = "";
  $code3 = "";
  $jug4 = "";
  $code4 = "";
  $jug5 = "";
  $code5 = "";

  $id = $_POST['id'];
  $jug1 = $_POST['jug1'];
  $code1 = $_POST['code1'];
  $jug2 = $_POST['jug2'];
  $code2 = $_POST['code2'];
  $jug3 = $_POST['jug3'];
  $code3 = $_POST['code3'];
  $jug4 = $_POST['jug4'];
  $code4 = $_POST['code4'];
  $jug5 = $_POST['jug5'];
  $code5 = $_POST['code5'];

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
  $sql="UPDATE t_etching SET 
        1st_jug = $jug1,
        1st_code = $code1,
        2nd_jug = $jug2,
        2nd_code = $code2,
        3rd_jug = $jug3,
        3rd_code = $code3,
        4th_jug = $jug4,
        4th_code = $code4,
        5th_jug = $jug5,
        5th_code = $code5
      WHERE id = $id ";
// print_r($sql);
    $prepare = $dbh->prepare($sql);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;