<?php
$userid = "webuser";
$passwd = "";

try {
    // Kết nối DB
    $dbh = new PDO(
        'mysql:host=localhost;dbname=extrusion;charset=utf8',
        $userid,
        $passwd,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    // Nhận tham số đầu vào
    $production_number = isset($_POST['production_number']) ? $_POST['production_number'] : '';

    // Thiết lập biến session SQL
    $dbh->exec("SET @washing_die_status = 4;");
    $dbh->exec("SET @specific_gravity_of_aluminium = 2.70;");
    $dbh->exec("SET @pi = 3.141459;");
    $dbh->exec("SET @inch = 25.4;");

    // Chuẩn bị giá trị tìm kiếm
    $searchValue = "%$production_number%";

    // Câu SQL chính
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
        ROUND(SUM(
            (
                (@pi * POWER(t_press.billet_size * @inch / 2, 2))
                * t_press.billet_length * 0.001
                * @specific_gravity_of_aluminium
                * t_press.actual_billet_quantities / 1000
            ) / m_production_numbers.specific_weight / 1000 / m_dies.hole
        ), 2) AS length_km_after_nitriding
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
dies_id_and_production_weight AS (
    SELECT 
        m_dies.id AS dies_id,
        m_dies.hole,
        m_production_numbers.specific_weight
    FROM m_dies
    LEFT JOIN m_production_numbers
        ON m_dies.production_number_id = m_production_numbers.id
),
total_profile_length_by_dies_id as (
  select 
    t_press.dies_id,
    cast(round(SUM(((@pi * POWER(t_press.billet_size * @inch / 2, 2) 
        * t_press.billet_length * 0.001 * @specific_gravity_of_aluminium
        * t_press.actual_billet_quantities / 1000) 
        / specific_weight /1000 / hole)), 1) as char) as total_profile_length,
    count(*) as total_press
  from t_press
  left join dies_id_and_production_weight
    on t_press.dies_id = dies_id_and_production_weight.dies_id
  group by t_press.dies_id
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
    INNER JOIN (
        SELECT dies_id, MAX(do_sth_at) AS max_do_sth_at
        FROM t_dies_status
        GROUP BY dies_id
    ) AS tmax ON t_dies_status.dies_id = tmax.dies_id
              AND t_dies_status.do_sth_at = tmax.max_do_sth_at
),
t20 AS (
    SELECT 
        t_using_aging_rack.t_press_id,
        SUM(t_using_aging_rack.work_quantity) AS work_quantity
    FROM
        t_using_aging_rack
    GROUP BY t_using_aging_rack.t_press_id
),
t30 AS (
    SELECT 
        t_using_aging_rack.t_press_id AS t_press_id,
        SUM(t_press_quality.ng_quantities) AS total_ng,
        SUM(CASE WHEN m_quality_code.quality_code = 401 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_401
    FROM t_using_aging_rack
    LEFT JOIN t_press_quality ON t_press_quality.using_aging_rack_id = t_using_aging_rack.id
    LEFT JOIN m_quality_code ON t_press_quality.quality_code_id = m_quality_code.id
    GROUP BY t_using_aging_rack.t_press_id
),
latest_press_by_die AS (
    SELECT dies_id, MAX(id) AS latest_press_id
    FROM t_press
    WHERE t_press.pressing_type_id = 3 
    GROUP BY dies_id
)
SELECT 
    m_dies.id AS dies_id,
    m_dies.die_number ,
    m_production_numbers.id AS production_id,
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
    CONCAT(
        ROUND(
            (t20.work_quantity - t30.total_ng + t30.code_401) / t20.work_quantity * 100,
            1
        ), '%'
    ) AS per,
    DATE_FORMAT(t10.do_sth_at, '%y-%m-%d %H:%i') AS do_sth_at,
    IFNULL(tpl.total_profile_length, 0) as total_profile_length,
    CASE
    WHEN FLOOR(
        (
            (
                CASE
                    WHEN m_dies_diamater.die_diamater <= 260 THEN 3
                    WHEN m_dies_diamater.die_diamater >= 300 THEN 2.5
                    ELSE 3
                END
                - COALESCE(pl.length_km_after_nitriding,0)
            )
            *1000
            *m_production_numbers.specific_weight
            *m_dies.hole
        )
        /
        (
            (@pi * POWER(t_press.billet_size * @inch / 2,2))
            * t_press.billet_length
            *0.001
            *@specific_gravity_of_aluminium
            /1000
        )
    ) < 0
    THEN ''
    ELSE CONCAT(
        FLOOR(
            (
                (
                    CASE
                        WHEN m_dies_diamater.die_diamater <= 260 THEN 3
                        WHEN m_dies_diamater.die_diamater >= 300 THEN 2.5
                        ELSE 3
                    END
                    - COALESCE(pl.length_km_after_nitriding,0)
                )
                *1000
                *m_production_numbers.specific_weight
                *m_dies.hole
            )
            /
            (
                (@pi * POWER(t_press.billet_size * @inch / 2,2))
                * t_press.billet_length
                *0.001
                *@specific_gravity_of_aluminium
                /1000
            )
        ),
        ' (',
        t_press.billet_length,
        'mm/',
        t_press.billet_size,
        'in)'
    )
END AS max_billet_display
FROM m_dies
LEFT JOIN latest_press_by_die lpb ON lpb.dies_id = m_dies.id
LEFT JOIN t_press ON t_press.id = lpb.latest_press_id
LEFT JOIN t10 ON t10.dies_id = m_dies.id
LEFT JOIN t20 ON t20.t_press_id = t_press.id
LEFT JOIN t30 ON t30.t_press_id = t_press.id
LEFT JOIN profile_length_after_nitriding_by_dies_id pl ON pl.dies_id = m_dies.id
LEFT JOIN washing_count_after_nitriding_by_dies_id wc ON wc.dies_id = m_dies.id
LEFT JOIN total_profile_length_by_dies_id tpl ON tpl.dies_id = m_dies.id
LEFT JOIN m_dies_diamater ON m_dies.die_diamater_id = m_dies_diamater.id
LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
WHERE 
    m_production_numbers.production_number LIKE :search_value1
    OR m_dies.die_number LIKE :search_value2
GROUP BY 
    m_dies.id, m_dies.die_number, t10.die_status, t10.die_status_id, 
    pl.length_km_after_nitriding, wc.washing_count_after_nitriding, 
    m_dies_diamater.die_diamater, t10.do_sth_at
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
    $prepare->bindValue(':search_value1', $searchValue, PDO::PARAM_STR);
    $prepare->bindValue(':search_value2', $searchValue, PDO::PARAM_STR);
    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    // Format kết quả hiển thị
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
