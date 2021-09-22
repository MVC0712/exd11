<?php
  /* 21/09/11 */
  $userid = "webuser";
  $passwd = "";

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
    $sql = "
      INSERT INTO t_using_aging_rack (t_press_id, order_number, rack_number, work_quantity)
      VALUES (:t_press_id, :order_number, :rack_number, :work_quantity)
    ";
    $prepare = $dbh->prepare($sql);
    $prepare->bindValue(':t_press_id', (INT)$_POST["t_press_id"], PDO::PARAM_INT);
    $prepare->bindValue(':order_number', (INT)$_POST["order_number"], PDO::PARAM_INT);
    $prepare->bindValue(':rack_number', (INT)$_POST["rack_number"], PDO::PARAM_INT);
    $prepare->bindValue(':work_quantity', (INT)$_POST["work_quantity"], PDO::PARAM_INT);
    $prepare->execute();
    $prepare = $dbh->prepare($sql);



    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
