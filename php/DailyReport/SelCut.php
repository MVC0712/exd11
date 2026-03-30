<?php
  /* 21/09/11 */
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
    SELECT 
      id, cut_date, cut_no1, cut_no2, 
      TIME_FORMAT(cut_start, '%H:%i') AS cut_start, 
      TIME_FORMAT(cut_end, '%H:%i') AS cut_end
    FROM
      extrusion.t_cut_press
    WHERE
      press_id = :id
    ");

    $prepare->bindValue(':id', $_POST["id"], PDO::PARAM_STR); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
