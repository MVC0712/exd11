<?php

  $userid = "webuser";
  $passwd = "";
  
  $h = $_POST['h'];
  $a = $_POST['a'];
  $b = $_POST['b'];
  $c = $_POST['c'];
  $d = $_POST['d'];
  $e = $_POST['e'];
  $f = $_POST['f'];
  $i = $_POST['i'];
  $k = $_POST['k'];
  $end = $_POST['end'];
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

    $prepare = $dbh->prepare("UPDATE m_production_numbers_sub SET
     h='$h',
     a='$a',
     b='$b',
     c='$c',
     d='$d',
     e='$e',
     f='$f',
     i='$i',
     k='$k',
     end='$end'
      WHERE id = '$id'
    ");

    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
