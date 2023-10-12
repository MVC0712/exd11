<?php
  $userid = "webuser";
  $passwd = "";

  $data = $_POST['data'];
  $data_json = json_decode($data);

  try {
      $dbh = new PDO(
          'mysql:host=localhost; dbname=extrusion; charset=utf8',
          $userid,
          $passwd,
          array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
          )
      );

    foreach ($data_json as $val) {
        $sql_paramater[] = "('{$val[0]}', '{$val[3]}', '{$val[4]}')";
    };
    $sql = "INSERT INTO t_import ";
    $sql = $sql."(ordersheet_id ,import_at , quantity) VALUES ";
    $sql = $sql.join(",", $sql_paramater);
      
    $prepare = $dbh->prepare($sql);
      
    $prepare->execute();
    echo json_encode("INSERTED");
    } catch (PDOException $e) {
        $error = $e->getMessage();
        print_r($error);
    }
  $dbh = null;
  