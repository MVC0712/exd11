<?php
  /* 21/05/17作成 */
  $userid = "webuser";
  $passwd = "";

// print_r($_POST);

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
    $prepare = $dbh->prepare("
      DELETE FROM t_press_work_length_quantity
      WHERE t_press_work_length_quantity.press_id = :targetId
    ");
    $prepare->bindValue(':targetId', (INT)$_POST["targetId"], PDO::PARAM_INT);
    $prepare->execute();

    for($i = 1; $i <= 2; $i ++){
      for($j = 1; $j <=3; $j ++){
        if($_POST['billet'.$i.'_'.$j.'_len'] && $_POST['billet'.$i.'_'.$j.'_qty']){
        $prepare = $dbh->prepare(
          "INSERT INTO t_press_work_length_quantity (
              press_id,
              billet_number,
              work_number,
              work_length,
              work_quantity
            ) VALUES (
              :targetId,
              :billet_number,
              :work_number,
              :work_length,
              :work_quantity
            )"
          );

        $prepare->bindValue(':targetId', (INT)$_POST["targetId"], PDO::PARAM_INT);
        $prepare->bindValue(':billet_number', $i, PDO::PARAM_INT);
        $prepare->bindValue(':work_number', $j, PDO::PARAM_INT);
        $prepare->bindValue(':work_length', $_POST['billet'.$i.'_'.$j.'_len'], PDO::PARAM_STR);
        $prepare->bindValue(':work_quantity', (INT)$_POST['billet'.$i.'_'.$j.'_qty'], PDO::PARAM_INT);
        $prepare->execute();
          // echo json_encode("INSERTED");
        } else {
          // echo "no run";
        }
      }
    }
    echo json_encode("INSERTED");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
