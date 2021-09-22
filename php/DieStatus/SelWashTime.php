<?php
  /* 21/03/26作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  
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
    t_press.dies_id,
    m_dies.die_number,
    SUM(CASE
        WHEN
            (t_press.press_date_at > (SELECT 
                    MAX(IFNULL(t_nitriding.nitriding_date_at,
                                '2000-01-01')) AS nitriding_date
                FROM
                    m_dies
                        LEFT JOIN
                    t_nitriding ON t_nitriding.dies_id = m_dies.id
                WHERE
                    m_dies.id = t_press.dies_id
                GROUP BY m_dies.id))
                AND (t_press.is_washed_die = 2)
        THEN
            1
        ELSE 0
    END) AS is_washed_die,
    m_dies_diamater.die_diamater
FROM
    t_press
        LEFT JOIN
    m_dies ON t_press.dies_id = m_dies.id
        LEFT JOIN
    m_dies_diamater ON m_dies.die_diamater_id = m_dies_diamater.id
WHERE
    t_press.dies_id = :die_id
    ");

    $prepare->bindValue(':die_id', $_POST["die_id"], PDO::PARAM_STR);
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
