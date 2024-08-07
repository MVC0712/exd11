<?php
  /* 24/06/09 */
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

        $sql = "
            SELECT 
                t_press.id,
                DATE_FORMAT(t_press.press_date_at, '%m-%d') AS press_date,
                t_press.press_machine_no,
                m_dies.die_number,
                t_press.dies_id,
                m_ordersheet.ordersheet_number,
                m_pressing_type.pressing_type,
                t_press.pressing_type_id,
                CASE t_press.is_washed_die
                    WHEN 1 THEN 'No'
                    WHEN 2 THEN 'Yes'
                    ELSE ''
                END AS is_washed_die,
                t_press.is_washed_die AS is_washed_die_id,
                IFNULL(t10.Bundle,
                        LEFT(t_press.billet_lot_number, 10)) AS billet_lot_number,
                t_press.billet_size,
                t_press.billet_length,
                t_press.plan_billet_quantities,
                t_press.actual_billet_quantities,
                t20.StopCode AS stop_cause,
                TIME_FORMAT(t_press.press_start_at, '%H:%i'),
                TIME_FORMAT(t_press.press_finish_at, '%H:%i'),
                format(t_press.actual_ram_speed, 1),
                t_press.actual_die_temperature,
                CASE
                    WHEN t_press.press_directive_scan_file_name IS NULL THEN 'No'
                    ELSE 'Yes'
                END,
                t_press.special_note
            FROM
                t_press
                    LEFT JOIN
                (SELECT 
                    press_id, CONCAT(bundle, 'x', quantity, '-', lot) AS Bundle
                FROM
                    extrusion.t_bundle) t10 ON t10.press_id = t_press.id
                    LEFT JOIN
                (SELECT 
                    press_id,
                        CONCAT(error_code, '-', TIME_FORMAT(start_time, '%H:%i'), '->', TIME_FORMAT(end_time, '%H:%i')) AS StopCode
                FROM
                    extrusion.t_error
                LEFT JOIN m_error_code ON m_error_code.id = t_error.error_code_id
                GROUP BY press_id) t20 ON t20.press_id = t_press.id
                    LEFT JOIN
                m_dies ON t_press.dies_id = m_dies.id
                    LEFT JOIN
                m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
                    LEFT JOIN
                m_press_stop_code ON t_press.press_stop_cause_id = m_press_stop_code.id
                    LEFT JOIN
                m_ordersheet ON t_press.ordersheet_id = m_ordersheet.id
                GROUP BY t_press.id
            ORDER BY t_press.press_date_at DESC , t_press.press_start_at
            LIMIT 100
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
