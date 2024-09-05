<?php
  /* 21/09/11 */
  $userid = "webuser";
  $passwd = "";

  // print_r(count($data_json));

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
      UPDATE t_using_aging_rack
        SET 
          t_using_aging_rack.rack_number = :rack_number,
          t_using_aging_rack.work_quantity = :work_quantity
      WHERE t_using_aging_rack.id = :id
    ";
    $prepare = $dbh->prepare($sql);
    $prepare->bindValue(':rack_number', (INT)$_POST["rack_number"], PDO::PARAM_INT);
    $prepare->bindValue(':work_quantity', (INT)$_POST["work_quantity"], PDO::PARAM_INT);
    $prepare->bindValue(':id', (INT)$_POST["id"], PDO::PARAM_INT);

    $prepare->execute();

    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
