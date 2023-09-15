<?php
  $userid = "webuser";
  $passwd = "";
  $wasshing_tank = "";
  $naoh_weight = "";
  $gluconat_weight = "";
  $change_staff = "";
  $wasshing_tank_change_at = "";

  $wasshing_tank = $_POST['wasshing_tank'];
  $naoh_weight = $_POST['naoh_weight'];
  $gluconat_weight = $_POST['gluconat_weight'];
  $change_staff = $_POST['change_staff'];
  $wasshing_tank_change_at = $_POST['wasshing_tank_change_at'];

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
                MAX(t_washing_tank.wasshing_tank_change_at) AS last_change
            FROM
                t_washing_tank
            WHERE
                wasshing_tank = $wasshing_tank";
        $prepare = $dbh->prepare($sql);
        $prepare->execute();
        $result = $prepare->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT 
                    SUM(CASE
                        WHEN
                            (t_dies_status.do_sth_at > (SELECT 
                                    MAX(t_washing_tank.wasshing_tank_change_at) AS wasshing_tank_change
                                FROM
                                    t_washing_tank
                                WHERE
                                    t_washing_tank.wasshing_tank = t_dies_status.tank
                                GROUP BY t_washing_tank.wasshing_tank))
                        THEN
                            1
                        ELSE 0
                    END) AS die_w
                FROM
                    t_dies_status
                        LEFT JOIN
                    t_washing_tank ON t_dies_status.tank = t_washing_tank.wasshing_tank
                WHERE
                    t_dies_status.die_status_id = 4
                        AND t_dies_status.tank IS NOT NULL
                        AND wasshing_tank = $wasshing_tank";
        $prepare = $dbh->prepare($sql);
        $prepare->execute();
        $result2 = $prepare->fetch(PDO::FETCH_ASSOC);

        $sql = "";
        $sql = "UPDATE t_washing_tank SET quantity = ".$result2['die_w']." WHERE wasshing_tank = $wasshing_tank AND wasshing_tank_change_at = '".$result['last_change']."'";
        $prepare = $dbh->prepare($sql);
        $prepare->execute();
        
        $sql = "";
        $sql = "INSERT INTO t_washing_tank 
        (wasshing_tank, naoh_weight, gluconat_weight, change_staff, wasshing_tank_change_at
        ) VALUES (
        '$wasshing_tank', '$naoh_weight', '$gluconat_weight', '$change_staff', '$wasshing_tank_change_at'
        )";
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
