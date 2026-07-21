<?php
$userid = "webuser";
$passwd = "";

$dieName = isset($_GET['dieName']) ? $_GET['dieName'] : '';

try {
    $dbh = new PDO(
        'mysql:host=localhost;dbname=extrusion;charset=utf8',
        $userid,
        $passwd,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    $dbh->exec("SET @washing_die_status = 4;");
    $dbh->exec("SET @specific_gravity_of_aluminium = 2.70;");
    $dbh->exec("SET @pi = 3.141459;");
    $dbh->exec("SET @inch = 25.4;");

    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="m_dies.csv"');

    $output = fopen("php://output", "w");

    // Header CSV
    $headers = [
        "id",
        "die_number",
        "die_diamater",
        "bolster_name",
        "production_number",
        "arrival_at",
        "updated_at",
        "hole",
        "die_postition",
        "die_weight",
        "aluminum_fill_weight",
        "after_nitriding_length",
        "washing_count_after_nitriding"
    ];
    fputcsv($output, $headers);

    // SQL
    $sql = "
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
    )
    SELECT 
      m_dies.id,
      m_dies.die_number,
      m_dies_diamater.die_diamater,
      IFNULL(m_bolster.bolster_name, '') AS bolster_name,
      m_production_numbers.production_number,
      IFNULL(DATE_FORMAT(m_dies.arrival_at, '%y-%m-%d'), '') AS arrival_at,
      IFNULL(DATE_FORMAT(m_dies.updated_at, '%y-%m-%d'), '') AS updated_at,
      m_dies.hole,
      m_dies.die_postition,
      m_dies.die_weight,
      m_dies.aluminum_fill_weight,
      ROUND(IFNULL(pl.length_km_after_nitriding, 0), 2) AS after_nitriding_length,
      IFNULL(wc.washing_count_after_nitriding, 0) AS washing_count_after_nitriding
    FROM m_dies
    LEFT JOIN m_production_numbers 
      ON m_dies.production_number_id = m_production_numbers.id
    LEFT JOIN m_dies_diamater 
      ON m_dies.die_diamater_id = m_dies_diamater.id
    LEFT JOIN m_billet_size 
      ON m_dies.billet_size_id = m_billet_size.id
    LEFT JOIN m_bolster 
      ON m_dies.bolstar_id = m_bolster.id
    LEFT JOIN profile_length_after_nitriding_by_dies_id pl ON pl.dies_id = m_dies.id
    LEFT JOIN washing_count_after_nitriding_by_dies_id wc ON wc.dies_id = m_dies.id
    WHERE m_dies.die_number LIKE :dieName
    ORDER BY m_dies.die_number
    ";

    $stmt = $dbh->prepare($sql);
    $stmt->bindValue(':dieName', "%$dieName%", PDO::PARAM_STR);
    $stmt->execute();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        fputcsv($output, $row);
    }

    fclose($output);
    exit;

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>