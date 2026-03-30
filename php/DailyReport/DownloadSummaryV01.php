<?php
$userid = "webuser";
$passwd = "";

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

    $file_path = "../../download/prsdt.csv";

    // Header CSV
    $export_header = [
        "Ma Khuon",
        "1/2025", "2/2025", "3/2025", "4/2025", "5/2025", "6/2025",
        "7/2025", "8/2025", "9/2025", "10/2025", "11/2025", "12/2025"
    ];

    $export_sql = "
        SELECT
    md.die_number AS ma_khuon,

    COALESCE(
    (
        SUM(
            CASE
                WHEN MONTH(tp.press_date_at) = 1 THEN
                    CASE
                        WHEN TIME_TO_SEC(tp.press_finish_at) >= TIME_TO_SEC(tp.press_start_at)
                        THEN TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at)
                        ELSE TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at) + 86400
                    END
            END
        )
        /
        NULLIF(
            SUM(
                CASE
                    WHEN MONTH(tp.press_date_at) = 1
                    THEN pw.work_quantity
                END
            ),
            0
        )
    ),
    0
) AS m1,

    COALESCE(
    (
        SUM(
            CASE
                WHEN MONTH(tp.press_date_at) = 2 THEN
                    CASE
                        WHEN TIME_TO_SEC(tp.press_finish_at) >= TIME_TO_SEC(tp.press_start_at)
                        THEN TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at)
                        ELSE TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at) + 86400
                    END
            END
        )
        /
        NULLIF(
            SUM(
                CASE
                    WHEN MONTH(tp.press_date_at) = 2
                    THEN pw.work_quantity
                END
            ),
            0
        )
    ),
    0
) AS m2,
    COALESCE(
    (
        SUM(
            CASE
                WHEN MONTH(tp.press_date_at) = 3 THEN
                    CASE
                        WHEN TIME_TO_SEC(tp.press_finish_at) >= TIME_TO_SEC(tp.press_start_at)
                        THEN TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at)
                        ELSE TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at) + 86400
                    END
            END
        )
        /
        NULLIF(
            SUM(
                CASE
                    WHEN MONTH(tp.press_date_at) = 3
                    THEN pw.work_quantity
                END
            ),
            0
        )
    ),
    0
) AS m3,

    COALESCE(
    (
        SUM(
            CASE
                WHEN MONTH(tp.press_date_at) = 4 THEN
                    CASE
                        WHEN TIME_TO_SEC(tp.press_finish_at) >= TIME_TO_SEC(tp.press_start_at)
                        THEN TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at)
                        ELSE TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at) + 86400
                    END
            END
        )
        /
        NULLIF(
            SUM(
                CASE
                    WHEN MONTH(tp.press_date_at) = 4
                    THEN pw.work_quantity
                END
            ),
            0
        )
    ),
    0
) AS m4,

    COALESCE(
    (
        SUM(
            CASE
                WHEN MONTH(tp.press_date_at) = 5 THEN
                    CASE
                        WHEN TIME_TO_SEC(tp.press_finish_at) >= TIME_TO_SEC(tp.press_start_at)
                        THEN TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at)
                        ELSE TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at) + 86400
                    END
            END
        )
        /
        NULLIF(
            SUM(
                CASE
                    WHEN MONTH(tp.press_date_at) = 5
                    THEN pw.work_quantity
                END
            ),
            0
        )
    ),
    0
) AS m5,
    COALESCE(
    (
        SUM(
            CASE
                WHEN MONTH(tp.press_date_at) = 6 THEN
                    CASE
                        WHEN TIME_TO_SEC(tp.press_finish_at) >= TIME_TO_SEC(tp.press_start_at)
                        THEN TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at)
                        ELSE TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at) + 86400
                    END
            END
        )
        /
        NULLIF(
            SUM(
                CASE
                    WHEN MONTH(tp.press_date_at) = 6
                    THEN pw.work_quantity
                END
            ),
            0
        )
    ),
    0
) AS m6,

    COALESCE(
    (
        SUM(
            CASE
                WHEN MONTH(tp.press_date_at) = 7 THEN
                    CASE
                        WHEN TIME_TO_SEC(tp.press_finish_at) >= TIME_TO_SEC(tp.press_start_at)
                        THEN TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at)
                        ELSE TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at) + 86400
                    END
            END
        )
        /
        NULLIF(
            SUM(
                CASE
                    WHEN MONTH(tp.press_date_at) = 7
                    THEN pw.work_quantity
                END
            ),
            0
        )
    ),
    0
) AS m7,
    COALESCE(
    (
        SUM(
            CASE
                WHEN MONTH(tp.press_date_at) = 8 THEN
                    CASE
                        WHEN TIME_TO_SEC(tp.press_finish_at) >= TIME_TO_SEC(tp.press_start_at)
                        THEN TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at)
                        ELSE TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at) + 86400
                    END
            END
        )
        /
        NULLIF(
            SUM(
                CASE
                    WHEN MONTH(tp.press_date_at) = 8
                    THEN pw.work_quantity
                END
            ),
            0
        )
    ),
    0
) AS m8,
    COALESCE(
    (
        SUM(
            CASE
                WHEN MONTH(tp.press_date_at) = 9 THEN
                    CASE
                        WHEN TIME_TO_SEC(tp.press_finish_at) >= TIME_TO_SEC(tp.press_start_at)
                        THEN TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at)
                        ELSE TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at) + 86400
                    END
            END
        )
        /
        NULLIF(
            SUM(
                CASE
                    WHEN MONTH(tp.press_date_at) = 9
                    THEN pw.work_quantity
                END
            ),
            0
        )
    ),
    0
) AS m9,

    COALESCE(
    (
        SUM(
            CASE
                WHEN MONTH(tp.press_date_at) = 10 THEN
                    CASE
                        WHEN TIME_TO_SEC(tp.press_finish_at) >= TIME_TO_SEC(tp.press_start_at)
                        THEN TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at)
                        ELSE TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at) + 86400
                    END
            END
        )
        /
        NULLIF(
            SUM(
                CASE
                    WHEN MONTH(tp.press_date_at) = 10
                    THEN pw.work_quantity
                END
            ),
            0
        )
    ),
    0
) AS m10,

    COALESCE(
    (
        SUM(
            CASE
                WHEN MONTH(tp.press_date_at) = 11 THEN
                    CASE
                        WHEN TIME_TO_SEC(tp.press_finish_at) >= TIME_TO_SEC(tp.press_start_at)
                        THEN TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at)
                        ELSE TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at) + 86400
                    END
            END
        )
        /
        NULLIF(
            SUM(
                CASE
                    WHEN MONTH(tp.press_date_at) = 11
                    THEN pw.work_quantity
                END
            ),
            0
        )
    ),
    0
) AS m11,

   COALESCE(
    (
        SUM(
            CASE
                WHEN MONTH(tp.press_date_at) = 12 THEN
                    CASE
                        WHEN TIME_TO_SEC(tp.press_finish_at) >= TIME_TO_SEC(tp.press_start_at)
                        THEN TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at)
                        ELSE TIME_TO_SEC(tp.press_finish_at) - TIME_TO_SEC(tp.press_start_at) + 86400
                    END
            END
        )
        /
        NULLIF(
            SUM(
                CASE
                    WHEN MONTH(tp.press_date_at) = 12
                    THEN pw.work_quantity
                END
            ),
            0
        )
    ),
    0
) AS m12

    
     
FROM m_dies md
LEFT JOIN t_press tp
    ON tp.dies_id = md.id
    AND YEAR(tp.press_date_at) = 2025
    AND tp.pressing_type_id IN (2,3)
    AND tp.actual_billet_quantities >= 7
    AND tp.press_start_at IS NOT NULL
    AND tp.press_finish_at IS NOT NULL
    AND tp.press_finish_at <> '00:00:00'

LEFT JOIN t_press_work_length_quantity pw
    ON pw.press_id = tp.id


GROUP BY md.id, md.die_number
ORDER BY md.die_number;



    ";

    if (touch($file_path)) {
        $file = new SplFileObject($file_path, "w");
        $file->fputcsv($export_header);

        $stmt = $dbh->prepare($export_sql);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $file->fputcsv([
                $row['ma_khuon'],
                $row['m1'],
                $row['m2'],
                $row['m3'],
                $row['m4'],
                $row['m5'],
                $row['m6'],
                $row['m7'],
                $row['m8'],
                $row['m9'],
                $row['m10'],
                $row['m11'],
                $row['m12']
            ]);
        }
    }

    echo json_encode("Made a CSV file");

} catch (PDOException $e) {
    echo "SQL ERROR: " . $e->getMessage();
}

$dbh = null;
