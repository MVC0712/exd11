<?php
  /* 21/06/22作成 */
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

      $sql = "SELECT 
                t_dies_status.id,
                CONCAT('Tank ', tank) AS tank,
                DATE_FORMAT((SELECT 
                                MAX(t_washing_tank.wasshing_tank_change_at) AS wasshing_tank_change
                            FROM
                                t_washing_tank
                            WHERE
                                t_washing_tank.wasshing_tank = t_dies_status.tank
                            GROUP BY t_washing_tank.wasshing_tank),
                        '%y-%m-%d %H:%i') AS wasshing_tank_change_at,
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
            WHERE
                t_dies_status.die_status_id = 4
                    AND t_dies_status.tank IS NOT NULL
            GROUP BY t_dies_status.tank
            UNION SELECT 
                '' AS id,
                'Shot 1' AS tank,
                CASE
                    WHEN
                        t_dies_status.id IS NOT NULL
                    THEN
                        (SELECT 
                                DATE_FORMAT(MAX(t_washing_shot.wasshing_shot_change_at),
                                            '%y-%m-%d %H:%i')
                            FROM
                                t_washing_shot)
                    ELSE ''
                END AS wasshing_tank_change_at,
                SUM(CASE
                    WHEN
                        (t_dies_status.do_sth_at > (SELECT 
                                MAX(t_washing_shot.wasshing_shot_change_at) AS wasshing_tank_change
                            FROM
                                t_washing_shot
                            GROUP BY t_washing_shot.wasshing_shot))
                    THEN
                        1
                    ELSE 0
                END) AS die_w
            FROM
                t_dies_status
            WHERE
                t_dies_status.die_status_id = 10
                    AND t_dies_status.tank IS NOT NULL
            ORDER BY tank ASC;
        ";

      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
