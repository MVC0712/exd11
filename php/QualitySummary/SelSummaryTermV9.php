<?php
  /* 21/08/08作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  $machine = $_POST['machine'] ?? 0;
$die_number = $_POST['die_number'] ?? '%';
$start_term = $_POST['start_term'] ?? '';
$end_term = $_POST['end_term'] ?? '';

if ($machine == 0) {
    $addMachine = "";
} else {
    $addMachine = " AND press_machine_no LIKE :machine";
}

$dateCondition = "";
if ($start_term !== '' && $end_term !== '') {
    $dateCondition = " AND t_press.press_date_at BETWEEN :start_term AND :end_term";
}

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
        t_press.id,
        DATE_FORMAT(t_press.press_date_at, '%y-%m-%d') AS prs_d,
        m_dies.die_number,
        m_pressing_type.pressing_type,
        t_press.plan_billet_quantities,
        t30.prs_quantity,
        t20.work_quantity,
        t10.total_ng,
        t20.work_quantity - t10.total_ng AS total_ok,
        CONCAT(ROUND((t20.work_quantity - t10.total_ng + t10.code_401) / t20.work_quantity * 100,
                    1),
                '%') AS per,
        DATE_FORMAT(t_press.dimension_check_date, '%m-%d') AS dcd,
        CASE
            WHEN
                (t_press_sub.etching_check_staff IS NOT NULL
                    AND t_press_sub.etching_finish = 1)
                    OR (t_press_sub.etching_check_staff IS NOT NULL
                    AND t_press_sub.etching_finish = 2)
            THEN
                DATE_FORMAT(t_press.etching_check_date, '%m-%d')
            WHEN
                (t_press_sub.etching_check_staff IS NULL
                    OR t_press_sub.etching_finish = 0)
            THEN
                ''
        END AS ett,
        DATE_FORMAT(t_press.hardness_check_date, '%m-%d'),
        CASE
            WHEN t_press.qc_check_id = 1 THEN 'Checked'
            WHEN t_press.qc_check_id = 2 THEN 'Checked'
            ELSE ''
        END AS qc_check_result,
        DATE_FORMAT(t_press.packing_check_date, '%m-%d'),
        t10.code_301,
        t10.code_302,
        t10.code_303,
        t10.code_304,
        t10.code_305,
        t10.code_306,
        t10.code_307,
        t10.code_308,
        t10.code_309,
        t10.code_310,
        t10.code_311,
        t10.code_312,
        t10.code_313,
        t10.code_314,
        t10.code_315,
        t10.code_316,
        t10.code_317,
        t10.code_318,
        t10.code_319,
        t10.code_320,
        t10.code_321,
        t10.code_322,
        t10.code_323,
        t10.code_324,
        t10.code_351,
        t10.code_401,
        CONCAT(
      FORMAT(
        ROUND(
          (
            tpq.quantity *
            IFNULL(mpn.specific_weight,0) *
            IFNULL(mpn.production_length,0)
          ) / 1000 /
          NULLIF(
            (
              (TIME_TO_SEC(t_press.press_finish_at) - TIME_TO_SEC(t_press.press_start_at))
              - IFNULL(ttp.stop_seconds, 0)
            ) / 3600
          ,0)
        ,4)
      ,2),
      ' ton/h'
    ) AS productivity,
    
    CONCAT(
  ROUND(
    (
      (
        (TIME_TO_SEC(t_press.press_finish_at) - TIME_TO_SEC(t_press.press_start_at))
        - IFNULL(ttp.stop_seconds, 0)
      )
      / NULLIF(tpq.quantity, 0)
    )
  , 0),
  ' s/pcs'
) AS actual_cycletime,
ROUND(
    (
      tpq.quantity *
      IFNULL(mpn.specific_weight,0) *
      IFNULL(mpn.production_length,0)
    ) / 1000
,2) AS total_weight,

CASE
    WHEN (
      tpq.quantity *
      IFNULL(mpn.specific_weight,0) *
      IFNULL(mpn.production_length,0)
    ) IS NULL
    OR (
      tpq.quantity *
      IFNULL(mpn.specific_weight,0) *
      IFNULL(mpn.production_length,0)
    ) = 0
    THEN NULL

    ELSE ROUND(
        NULLIF(
          (
            (TIME_TO_SEC(t_press.press_finish_at) - TIME_TO_SEC(t_press.press_start_at))
            - IFNULL(ttp.stop_seconds, 0)
          ) / 3600
        ,0)
    ,2)
END AS total_time,
        t_press.special_note
    FROM t_press
    LEFT JOIN m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
    LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
    LEFT JOIN (
  SELECT id, specific_weight, production_length
  FROM m_production_numbers
) mpn ON m_dies.production_number_id = mpn.id
    LEFT JOIN t_press_sub ON t_press.id = t_press_sub.press_id
    LEFT JOIN t_press_work_length_quantity ON t_press.id = t_press_work_length_quantity.press_id
LEFT JOIN (
  SELECT 
    press_id,
    SUM(work_quantity) AS quantity
  FROM t_press_work_length_quantity
  GROUP BY press_id
) tpq ON tpq.press_id = t_press.id
LEFT JOIN t_time_press ON t_time_press.press_id = t_press.id
LEFT JOIN (
  SELECT 
    press_id,
    SUM(
      CASE 
        WHEN Code <> 700
        THEN (TIME_TO_SEC(time_end) - TIME_TO_SEC(time_start))
        ELSE 0
      END
    ) AS stop_seconds
  FROM t_time_press
  GROUP BY press_id
) ttp ON ttp.press_id = t_press.id
    LEFT JOIN 
        (
            SELECT 
                t_using_aging_rack.t_press_id AS t_press_id,
                SUM(t_press_quality.ng_quantities) AS total_ng,
			SUM(CASE WHEN m_quality_code.quality_code = 301 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_301,
		  SUM(CASE WHEN m_quality_code.quality_code = 302 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_302,
		  SUM(CASE WHEN m_quality_code.quality_code = 303 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_303,
		  SUM(CASE WHEN m_quality_code.quality_code = 304 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_304,
		  SUM(CASE WHEN m_quality_code.quality_code = 305 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_305,
		  SUM(CASE WHEN m_quality_code.quality_code = 306 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_306,
		  SUM(CASE WHEN m_quality_code.quality_code = 307 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_307,
		  SUM(CASE WHEN m_quality_code.quality_code = 308 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_308,
		  SUM(CASE WHEN m_quality_code.quality_code = 309 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_309,
		  SUM(CASE WHEN m_quality_code.quality_code = 310 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_310,
		  SUM(CASE WHEN m_quality_code.quality_code = 311 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_311,
		  SUM(CASE WHEN m_quality_code.quality_code = 312 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_312,
		  SUM(CASE WHEN m_quality_code.quality_code = 313 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_313,
		  SUM(CASE WHEN m_quality_code.quality_code = 314 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_314,
		  SUM(CASE WHEN m_quality_code.quality_code = 315 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_315,
		  SUM(CASE WHEN m_quality_code.quality_code = 316 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_316,
		  SUM(CASE WHEN m_quality_code.quality_code = 317 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_317,
		  SUM(CASE WHEN m_quality_code.quality_code = 318 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_318,
		  SUM(CASE WHEN m_quality_code.quality_code = 319 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_319,
		  SUM(CASE WHEN m_quality_code.quality_code = 320 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_320,
		  SUM(CASE WHEN m_quality_code.quality_code = 321 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_321,
		  SUM(CASE WHEN m_quality_code.quality_code = 322 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_322,
		  SUM(CASE WHEN m_quality_code.quality_code = 323 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_323,
		  SUM(CASE WHEN m_quality_code.quality_code = 324 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_324,
		  SUM(CASE WHEN m_quality_code.quality_code = 351 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_351,
		  SUM(CASE WHEN m_quality_code.quality_code = 401 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_401
		FROM t_using_aging_rack
		LEFT JOIN t_press_quality ON t_press_quality.using_aging_rack_id = t_using_aging_rack.id
		LEFT JOIN m_quality_code ON t_press_quality.quality_code_id = m_quality_code.id
		GROUP BY t_using_aging_rack.t_press_id
	) t10 ON t10.t_press_id = t_press.id 
LEFT JOIN
        (SELECT 
            t_using_aging_rack.t_press_id,
                SUM(t_using_aging_rack.work_quantity) AS work_quantity
        FROM
            t_using_aging_rack
        GROUP BY t_using_aging_rack.t_press_id) t20 ON t20.t_press_id = t_press.id
    LEFT JOIN
        (SELECT 
            t_bundle.press_id, SUM(t_bundle.quantity) AS prs_quantity
        FROM
            t_bundle
        GROUP BY t_bundle.press_id) t30 ON t30.press_id = t_press.id
    WHERE m_dies.die_number LIKE :die_number
        $dateCondition
        $addMachine
    GROUP BY t_press.id
    ORDER BY t_press.press_date_at DESC, t_press.press_start_at
    LIMIT 400";

    $prepare = $dbh->prepare($sql);

    $prepare->bindValue(':die_number', $die_number, PDO::PARAM_STR);

    if ($machine != 0) {
        $prepare->bindValue(':machine', $machine, PDO::PARAM_STR);
    }

    if ($start_term !== '' && $end_term !== '') {
        $prepare->bindValue(':start_term', $start_term, PDO::PARAM_STR);
        $prepare->bindValue(':end_term', $end_term, PDO::PARAM_STR);
    }

    $prepare->execute();
    $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$dbh = null;
