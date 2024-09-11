<?php
  /* 21/09/10 */

  $userid = "webuser";
  $passwd = "";
  $press_id = $_POST['press_id'];
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

    $stmt = $dbh->prepare("DELETE FROM t_press_sub_data WHERE press_id = $press_id");
    $stmt->execute();

    $stmt = $dbh->prepare("DELETE FROM t_bundle WHERE press_id = $press_id");
    $stmt->execute();

    $stmt = $dbh->prepare("DELETE FROM t_using_aging_rack WHERE t_press_id = $press_id");
    $stmt->execute();

    echo(json_encode("Deleted"));
  } catch (PDOException $e){
    $error = $e->getMessage();
    // $pdh->rollback();
    print_r($error);
  }
  $dbh = null;
?>
