<?php
  /* 24-12-21 made */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  
try {
    $dbh = new PDO(
        'mysql:host=localhost;dbname=extrusion;charset=utf8',
        $userid,
        $passwd,
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        )
    );

    // 最新の日付を取得し、変数に格納
    $stmt = $dbh->prepare("
        SELECT MAX(t_press_directive.created_at) INTO @latest_date
        FROM t_press_directive;
    ");
    $stmt->execute();

    // 1か月前の日付を計算し、変数に格納
    $stmt = $dbh->prepare("
        SELECT DATE_SUB(MAX(t_press_directive.created_at), INTERVAL 3 MONTH) INTO @one_month_ago
        FROM t_press_directive;
    ");
    $stmt->execute();

    // 最後のクエリを実行
    $stmt = $dbh->prepare("
        SELECT 
            m_staff.id,
            m_staff.staff_name,
            COALESCE(table_1.COUNT, 0) AS COUNT
        FROM m_staff
        LEFT JOIN (
            SELECT 
                t_press_directive.incharge_person_id,
                COUNT(*) AS COUNT
            FROM 
                t_press_directive
            WHERE 
                t_press_directive.created_at BETWEEN @one_month_ago AND @latest_date
            GROUP BY 
                t_press_directive.incharge_person_id
            ORDER BY 
                COUNT DESC
        ) AS table_1
        ON m_staff.id = table_1.incharge_person_id
        WHERE m_staff.position_id = 2
        ORDER BY COUNT DESC;
    ");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);

  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
