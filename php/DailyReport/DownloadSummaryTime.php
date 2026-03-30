<?php
$userid = "webuser";
$passwd = "";

// Lấy ngày bắt đầu và kết thúc từ POST
$start = $_POST['start_date'] ?? '';
$end = $_POST['end_date'] ?? '';

if ($start == "" || $end == "") {
    $add = "";
} else {
    $add = " AND t_time_press.time_date BETWEEN '$start' AND '$end'";
}

try {
    // Kết nối CSDL
    $dbh = new PDO(
        'mysql:host=localhost; dbname=extrusion; charset=utf8',
        $userid,
        $passwd,
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        )
    );

    // Đường dẫn file CSV
    $file_path = "../../download/prsdt_extrusion.csv";

    // Tiêu đề cột CSV
    $export_csv_title = [
        "ngay_dun", "ma_khuon", "ma_san_pham", "kieu_dun", "may_dun",
        "code", "thoi_gian_bat_dau", "thoi_gian_ket_thuc",
        "khoang_thoi_gian (min)", "so_thanh", "khoi_luong_1_thanh (kg)", "tong_khoi_luong (kg)", "nang_suat (ton/h)", "cycletime_thuc_te (s)"
    ];

    // Câu truy vấn SQL chính
    $export_sql = "
        SELECT
            DATE_FORMAT(t_time_press.time_date, '%Y-%m-%d') AS time_date,
            m_dies.die_number,
            m_production_numbers.production_number,
            CASE t_press.pressing_type_id
                WHEN 1 THEN '〇'
                WHEN 2 THEN '◎'
                ELSE '●'
            END AS pressing_type,
            t_press.press_machine_no,
            t_time_press.Code,
            TIME_FORMAT(t_time_press.time_start, '%H:%i') AS time_start, 
            TIME_FORMAT(t_time_press.time_end, '%H:%i') AS time_end, 
            FLOOR((TIME_TO_SEC(t_time_press.time_end) - TIME_TO_SEC(t_time_press.time_start)) / 60) AS time_diff_minutes,
        
            -- Chỉ tính tổng nếu Code = '700'
            SUM(CASE WHEN t_time_press.Code = '700' THEN t_press_work_length_quantity.work_quantity ELSE 0 END) AS total_quantity,
        
            ROUND(
              CASE 
                WHEN t_time_press.Code = '700' THEN m_production_numbers.specific_weight * m_production_numbers.production_length
               ELSE NULL
              END, 3
            ) AS work_weight,
        
           ROUND(
             CASE 
               WHEN t_time_press.Code = '700' THEN t_press_work_length_quantity.work_quantity *
               m_production_numbers.specific_weight * m_production_numbers.production_length
             ELSE NULL
             END, 2
            ) AS total_weight,
        
            ROUND(
              CASE 
                WHEN t_time_press.Code = '700' THEN ((t_press_work_length_quantity.work_quantity *
                m_production_numbers.specific_weight * m_production_numbers.production_length)/1000)/
                ((TIME_TO_SEC(t_time_press.time_end) - TIME_TO_SEC(t_time_press.time_start)) / 60/60)
              ELSE NULL
              END,2
            ) AS productivity,
        
            ROUND(
             CASE 
                WHEN t_time_press.Code = '700' THEN (TIME_TO_SEC(t_time_press.time_end) - TIME_TO_SEC(t_time_press.time_start)) / 
               (t_press_work_length_quantity.work_quantity)
             ELSE NULL
             END,2
           ) AS actual_cycletime
        FROM
            t_time_press
        LEFT JOIN t_press ON t_time_press.press_id = t_press.id
        LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
        LEFT JOIN m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
        LEFT JOIN m_production_numbers ON m_dies.production_number_id = m_production_numbers.id
        LEFT JOIN t_press_work_length_quantity ON t_press.id = t_press_work_length_quantity.press_id
        WHERE 1=1
        $add
        GROUP BY
           t_time_press.time_date,
          m_dies.die_number,
           m_production_numbers.production_number,
           t_press.pressing_type_id,
           t_time_press.Code,
           t_time_press.time_start,
           t_time_press.time_end
        ORDER BY
            t_time_press.time_date DESC,
           t_time_press.time_start ASC,
          t_time_press.Code DESC
    ";

    // Chuẩn bị file CSV
    foreach ($export_csv_title as $val) {
        $export_header[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
    }

    if (touch($file_path)) {
        $file = new SplFileObject($file_path, "w");
        $file->fputcsv($export_header);

        $stmt = $dbh->query($export_sql);

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Làm tròn thời gian nếu có
            if (isset($row['time_diff_minutes'])) {
                $row['time_diff_minutes'] = intval($row['time_diff_minutes']);
            }

            // ✅ Nếu Code ≠ 700, để trống total_quantity
            if ($row['Code'] != '700') {
                $row['total_quantity'] = '';
            }

            // Ghi vào file CSV
            $file->fputcsv(mb_convert_encoding($row, 'UTF-8', 'UTF-8'));
        }
    }

    echo json_encode("Made a CSV file");

} catch (PDOException $e) {
    print('Connection failed: ' . $e->getMessage());
    die();
}

$dbh = null;
?>
