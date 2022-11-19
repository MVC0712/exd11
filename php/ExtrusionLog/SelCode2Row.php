<?php
  $userid = "webuser";
  $passwd = "";

  $code_search = $_POST["code_search"];
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
    id, code, description AS ds, 1 AS 'o'
FROM
    m_code
WHERE
    code LIKE '%$code_search%' OR description LIKE '%$code_search%' 
UNION SELECT 
    id, code, description_ja AS ds, 2 AS 'o'
FROM
    m_code
WHERE
    code LIKE '%$code_search%'
        OR description_ja LIKE '%$code_search%'
ORDER BY code ASC , o ASC
    ");
    $prepare->execute();
    $result = $prepare->fetchALL(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
