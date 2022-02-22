<?php
  $userid = "webuser";
  $passwd = "";

  $id = "";

  $id = $_POST['id'];

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

      $sql = "
        SELECT 
            production_number_id,
            DATE_FORMAT(export_at, '%Y-%m-%dT%H:%i') AS export_at,
            quantity
        FROM
            extrusion.t_export
        WHERE
            id = $id ";      
      
      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($result);
      } catch (PDOException $e) {
          $error = $e->getMessage();
          print_r($error);
      }
  $dbh = null;
  