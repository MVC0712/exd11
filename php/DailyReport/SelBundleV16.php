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

    $prepare = $dbh->prepare("
      SELECT 
        id, bundle, quantity, lot, mfg, insp, note
      FROM
        extrusion.t_bundle
      WHERE
        press_id = :id
    ");

    $prepare->bindValue(':id', $_POST["id"], PDO::PARAM_STR); 
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    // Nếu insp rỗng thì thay bằng "OK"
    foreach ($result as &$row) {
      if (empty($row['insp'])) {
        $row['insp'] = "1";
      }
    }
    unset($row);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>

