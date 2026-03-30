<?php
$userid = "webuser";
$passwd = "";

try {
  $dbh = new PDO(
    'mysql:host=localhost;dbname=extrusion;charset=utf8',
    $userid,
    $passwd,
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_EMULATE_PREPARES => false
    ]
  );

  $sql = "SELECT code FROM t_note_ng_quality
          WHERE press_date = :press_date AND die_id = :die_id";
  $prepare = $dbh->prepare($sql);
  $prepare->bindValue(":press_date", $_POST["press_date"], PDO::PARAM_STR);
  $prepare->bindValue(":die_id", $_POST["dies_id"], PDO::PARAM_INT);
  $prepare->execute();

  $result = $prepare->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($result);

} catch (PDOException $e) {
  echo json_encode(["error" => $e->getMessage()]);
}
