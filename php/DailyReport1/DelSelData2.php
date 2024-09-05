<?php
  /* 21/05/20更新 */

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

    $stmt = $dbh->prepare("
      SELECT t_press.ordersheet_id
      FROM t_press
      WHERE t_press.id = :id
    ");
    $stmt->bindValue(':id', (INT)$_POST["id"], PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // $stmt = $dbh->prepare("DELETE FROM m_ordersheet WHERE m_ordersheet.id=:id");
    // $stmt->bindValue(':id', (INT)$result["ordersheet_id"], PDO::PARAM_INT);
    // $stmt->execute();

    $stmt = $dbh->prepare("DELETE FROM t_press_work_length_quantity WHERE press_id=:id");
    $stmt->bindValue(':id', (INT)$_POST["id"], PDO::PARAM_INT);
    $stmt->execute();

    $stmt = $dbh->prepare("DELETE FROM t_press WHERE id=:id");
    $stmt->bindValue(':id', (INT)$_POST["id"], PDO::PARAM_INT);
    $stmt->execute();

    echo(json_encode("Deleted"));


  } catch (PDOException $e){
    $error = $e->getMessage();
    // $pdh->rollback();
    print_r($error);
  }
  $dbh = null;
?>
