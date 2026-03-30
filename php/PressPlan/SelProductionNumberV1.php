<?php
$userid = "webuser";
$passwd = "";

try {
    // Kết nối DB với PDO
    $dbh = new PDO(
        'mysql:host=localhost;dbname=extrusion;charset=utf8',
        $userid,
        $passwd,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    // Lấy tham số đầu vào (POST hoặc GET đều được, sửa theo nhu cầu)
    $production_number = isset($_POST['production_number']) ? $_POST['production_number'] : '';
    // Nếu bạn gửi GET thì dùng: $_GET['production_number']

    // Thiết lập biến session SQL nếu cần
    $dbh->exec("SET @washing_die_status = 4;");
    $dbh->exec("SET @specific_gravity_of_aluminium = 2.70;");
    $dbh->exec("SET @pi = 3.141459;");
    $dbh->exec("SET @inch = 25.4;");

    // Chuẩn bị giá trị tìm kiếm với wildcard %
    $searchValue = "%$production_number%";

    // Câu SQL với tham số :search_value dùng chung cho production_number và die_number
    $sql = <<<SQL
WITH
latest_nitriding_date_by_dies_id AS (
    SELECT
        m_dies.id AS dies_id,
        IFNULL(MAX(t10.nitriding_date_at), DATE('2021-01-01')) AS nitriding_date_at
    FROM m_dies
    LEFT JOIN t_nitriding t10 ON m_dies.id = t10.dies_id
    GROUP BY m_dies.id
),
profile_length_after_nitriding_by_dies_id AS (
    SELECT
        t_press.dies_id,
        CAST(ROUND(SUM(
            (
                (@pi * POWER(t_press.billet_size * @inch / 2, 2))
                * t_press.billet_length * 0.001
                * @specific_gravity_of_aluminium
                * t_press.actual_billet_quantities / 1000
            ) / m_production_numbers.specific_weight / 1000 / m_dies.hole
        ), 2) AS CHAR) AS length_km_after_nitriding
    FROM latest_nitriding_date_by_dies_id
    LEFT JOIN t_press ON t_press.dies_id = latest_nitriding_date_by_dies_id.dies_id
    LEFT JOIN m_dies ON latest_nitriding_date_by_dies_id.dies_id = m_dies.id
    LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
    WHERE t_press.press_date_at > latest_nitriding_date_by_dies_id.nitriding_date_at
    GROUP BY t_press.dies_id
),
washing_count_after_nitriding_by_dies_id AS (
    SELECT 
        t_dies_status.dies_id,
        COUNT(*) AS washing_count_after_nitriding
    FROM t_dies_status
    LEFT JOIN latest_nitriding_date_by_dies_id ON t_dies_status.dies_id = latest_nitriding_date_by_dies_id.dies_id
    WHERE t_dies_status.die_status_id = @washing_die_status
      AND t_dies_status.do_sth_at > latest_nitriding_date_by_dies_id.nitriding_date_at
    GROUP BY t_dies_status.dies_id
),
t10 AS (
    SELECT 
      t_dies_status.dies_id,
      m_die_status.die_status,
      t_dies_status.die_status_id,
      t_dies_status.do_sth_at,
      t_dies_status.note,
      t_dies_status.staff_id,
      m_staff.staff_name,
      t_dies_status.tank,
      t_dies_status.specific_value
    FROM
      t_dies_status
    LEFT JOIN m_die_status ON t_dies_status.die_status_id = m_die_status.id
    LEFT JOIN m_staff ON t_dies_status.staff_id = m_staff.id
    LEFT JOIN (SELECT 
        t_dies_status.dies_id,
        t_dies_status.die_status_id,
        MAX(t_dies_status.do_sth_at) AS do_sth_at,
        t_dies_status.staff_id,
        t_dies_status.tank
      FROM
        t_dies_status
      GROUP BY t_dies_status.dies_id) AS t10 ON t_dies_status.dies_id = t10.dies_id
          AND t_dies_status.do_sth_at = t10.do_sth_at
    WHERE
      t10.dies_id IS NOT NULL
)
SELECT 
    m_dies.id AS dies_id,
    m_dies.die_number,
    m_production_numbers.id,
    m_production_numbers.production_number,
    SUM(CASE
        WHEN CONCAT(t_press.press_date_at, ' ', DATE_FORMAT(t_press.press_start_at, '%H:%i')) > 
             (SELECT MAX(IFNULL(t_dies_status.do_sth_at,'2000-01-01 00:00')) 
              FROM t_dies_status 
              WHERE t_dies_status.dies_id = t_press.dies_id
                AND (t_dies_status.die_status_id = 4 OR t_dies_status.die_status_id = 10)) 
        THEN 1 ELSE 0
    END) AS is_washed_die,
    CONCAT(t10.die_status, ' ', IFNULL(t10.tank, '')) AS die_status,
    t10.die_status_id AS die_status_id,
    ROUND(IFNULL(pl.length_km_after_nitriding, 0), 2) AS after_nitriding_length,
    IFNULL(wc.washing_count_after_nitriding, 0) AS washing_count_after_nitriding,
    m_dies_diamater.die_diamater AS die_diamater,
    DATE_FORMAT(t10.do_sth_at, '%y-%m-%d %H:%i') AS do_sth_at
FROM m_dies
LEFT JOIN t_press ON t_press.dies_id = m_dies.id
LEFT JOIN t10 ON t10.dies_id = m_dies.id
LEFT JOIN profile_length_after_nitriding_by_dies_id pl ON pl.dies_id = m_dies.id
LEFT JOIN washing_count_after_nitriding_by_dies_id wc ON wc.dies_id = m_dies.id
LEFT JOIN m_dies_diamater ON m_dies.die_diamater_id = m_dies_diamater.id
LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
WHERE 
    m_production_numbers.production_number LIKE :search_value1
    OR m_dies.die_number LIKE :search_value2
GROUP BY m_dies.id, m_dies.die_number, t10.die_status, t10.die_status_id, pl.length_km_after_nitriding, wc.washing_count_after_nitriding, m_dies_diamater.die_diamater, t10.do_sth_at
ORDER BY
    CASE t10.die_status
        WHEN 'Grinding' THEN 9
        WHEN 'Wire cutting' THEN 8
        WHEN 'NG' THEN 7
        WHEN 'NG Rz/Die mark' THEN 6
        WHEN 'NG Kích thước' THEN 5
        WHEN 'Washing' THEN 4
        WHEN 'OK' THEN 3
        WHEN 'Measuring' THEN 2
        WHEN 'On rack' THEN 1
        ELSE 0
    END DESC,
    m_dies.die_number ASC
SQL;

    $prepare = $dbh->prepare($sql);

    // Bind 2 tham số cho 2 điều kiện LIKE
    $prepare->bindValue(':search_value1', $searchValue, PDO::PARAM_STR);
    $prepare->bindValue(':search_value2', $searchValue, PDO::PARAM_STR);

    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    // Format dữ liệu: thêm ' km' vào after_nitriding_length nếu khác 0
    foreach ($result as &$row) {
        $val = (float)$row['after_nitriding_length'];
        $row['after_nitriding_length'] = $val == 0 ? '0' : number_format($val, 2, '.', '') . ' km';
    }
    unset($row);

    echo json_encode(['success' => true, 'data' => $result]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$dbh = null;
?>
