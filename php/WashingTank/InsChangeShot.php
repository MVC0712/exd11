<?php
  $userid = "webuser";
  $passwd = "";
  $wasshing_shot = "";
  $glass_weight = "";
  $change_shot_staff = "";
  $wasshing_shot_change_at = "";

  $wasshing_shot = $_POST['wasshing_shot'];
  $glass_weight = $_POST['glass_weight'];
  $change_shot_staff = $_POST['change_shot_staff'];
  $wasshing_shot_change_at = $_POST['wasshing_shot_change_at'];

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

        $sql = "SELECT 
                MAX(t_washing_shot.wasshing_shot_change_at) AS last_change
            FROM
                t_washing_shot
            WHERE
                wasshing_shot = $wasshing_shot";
        $prepare = $dbh->prepare($sql);
        $prepare->execute();
        $result = $prepare->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT 
                    SUM(CASE
                        WHEN
                            (t_dies_status.do_sth_at > (SELECT 
                                    MAX(t_washing_shot.wasshing_shot_change_at) AS wasshing_shot_change
                                FROM
                                    t_washing_shot
                                GROUP BY t_washing_shot.wasshing_shot))
                        THEN
                            1
                        ELSE 0
                    END) AS die_s
                FROM
                    t_dies_status
                WHERE
                    t_dies_status.die_status_id = 4";
        $prepare = $dbh->prepare($sql);
        $prepare->execute();
        $result2 = $prepare->fetch(PDO::FETCH_ASSOC);

        $sql = "";
        $sql = "UPDATE t_washing_shot SET quantity = ".$result2['die_s']." WHERE wasshing_shot = $wasshing_shot AND wasshing_shot_change_at = '".$result['last_change']."'";
        $prepare = $dbh->prepare($sql);
        $prepare->execute();
        
        $sql = "";
        $sql = "INSERT INTO t_washing_shot 
        (wasshing_shot, glass_weight, change_shot_staff, wasshing_shot_change_at
        ) VALUES (
        '$wasshing_shot', '$glass_weight', '$change_shot_staff', '$wasshing_shot_change_at'
        )";
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
