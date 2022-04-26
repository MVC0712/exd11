<?php
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

    $prepare = $dbh->prepare("
      SELECT 
        pressing_type_id,
        m_pressing_type.pressing_type,
        billet_size,
        billet_length,
        billet_input_quantity,
        ram_speed
      FROM
        t_press_directive
      LEFT JOIN
        m_pressing_type ON m_pressing_type.id = t_press_directive.pressing_type_id
      WHERE
        t_press_directive.id = :id
    ");

    $prepare->bindValue(':id', $_POST["id"], (INT)PDO::PARAM_INT);
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
