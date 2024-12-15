<?php
  /* 24-12-15 made */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  
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
      $prepare = $dbh->prepare("
        SELECT 
            m_dies.hole
        FROM
            m_dies
        WHERE
            m_dies.id = (SELECT 
                    t_press_directive.dies_id
                FROM
                    t_press_directive
                WHERE
                    t_press_directive.id = :targetId);

      ");

      $prepare->bindValue(':targetId', $_POST["targetId"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
