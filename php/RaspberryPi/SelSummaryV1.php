<?php

header('Content-Type: application/json; charset=utf-8');

$userid = "webuser";
$passwd = "";

try {

    $machine    = isset($_POST['machine']) ? (int)$_POST['machine'] : 0;
    $dieNumber  = trim($_POST['die_number'] ?? '');
    $date       = trim($_POST['date'] ?? '');

    $pdo = new PDO(
        'mysql:host=localhost;dbname=extrusion;charset=utf8mb4',
        $userid,
        $passwd,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Dynamic WHERE
    |--------------------------------------------------------------------------
    */

    $where = ["die_name LIKE :die_number"];

    $params = [
        ':die_number' => "%{$dieNumber}%"
    ];

    if ($machine > 0) {
        $where[] = "machine = :machine";
        $params[':machine'] = $machine;
    }

    if ($date !== '') {
        $where[] = "DATE(date_time) = :date";
        $params[':date'] = $date;
    }

    $whereSql = implode(' AND ', $where);

    /*
    |--------------------------------------------------------------------------
    | SQL
    |--------------------------------------------------------------------------
    */

    $sql = "

    WITH base AS (

        SELECT
            id,
            date_time,
            DATE(date_time) AS run_date,

            press_mode,
            die_name,
            billet_counter,
            machine,

            LAG(die_name) OVER (
                PARTITION BY machine, DATE(date_time)
                ORDER BY date_time, id
            ) AS prev_die,

            LAG(billet_counter) OVER (
                PARTITION BY machine, DATE(date_time)
                ORDER BY date_time, id
            ) AS prev_counter,

            LAG(press_mode) OVER (
                PARTITION BY machine, DATE(date_time)
                ORDER BY date_time, id
            ) AS prev_press_mode

        FROM t_plc_web_log

        WHERE {$whereSql}
    ),

    mark_run AS (

        SELECT
            *,

            CASE
                WHEN prev_die IS NULL THEN 1
                WHEN die_name <> prev_die THEN 1
                WHEN billet_counter < prev_counter THEN 1
                ELSE 0
            END AS new_run

        FROM base
    ),

    run_group AS (

        SELECT
            *,

            SUM(new_run) OVER (
                PARTITION BY machine, run_date
                ORDER BY date_time, id
            ) AS run_id

        FROM mark_run
    ),

    runs AS (

        SELECT
            *,

            FIRST_VALUE(billet_counter) OVER (
                PARTITION BY machine, run_date, run_id
                ORDER BY date_time, id
            ) AS start_billet

        FROM run_group
    )

    SELECT

        run_id,

        DATE_FORMAT(
            MIN(date_time),
            '%y-%m-%d'
        ) AS date,

        die_name,
        machine,

        CASE
            WHEN TIME(MIN(date_time)) < '08:00:00'
            THEN '08:00'
            ELSE DATE_FORMAT(MIN(date_time), '%H:%i')
        END AS start_time,

        DATE_FORMAT(

            COALESCE(

                LEAD(MIN(date_time)) OVER (
                    PARTITION BY machine, run_date
                    ORDER BY MIN(date_time)
                ),

                MAX(date_time)

            ),

            '%H:%i'

        ) AS end_time,

        CASE
            WHEN TIME(MIN(date_time)) < '08:00:00'
            THEN '08:00'
            ELSE DATE_FORMAT(MIN(date_time), '%H:%i')
        END AS start_die_change,

        DATE_FORMAT(

            MIN(

                CASE

                    WHEN run_id = 1
                         AND press_mode = 1
                    THEN date_time

                    WHEN run_id <> 1
                         AND prev_press_mode = 0
                         AND press_mode = 1
                         AND billet_counter > start_billet
                    THEN date_time

                END

            ),

            '%H:%i'

        ) AS end_die_change,

        MIN(billet_counter) AS start_billet,
        MAX(billet_counter) AS end_billet,

        MAX(billet_counter) - MIN(billet_counter) AS total_billet

    FROM runs

    GROUP BY
        run_id,
        machine,
        die_name,
        run_date

    HAVING total_billet > 0

    ORDER BY
        date DESC,
        start_time DESC

    ";

    $stmt = $pdo->prepare($sql);

    foreach ($params as $key => $value) {

        $type = is_int($value)
            ? PDO::PARAM_INT
            : PDO::PARAM_STR;

        $stmt->bindValue($key, $value, $type);
    }

    $stmt->execute();

    echo json_encode(
        $stmt->fetchAll(),
        JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
    );

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'status'  => 'error',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

}