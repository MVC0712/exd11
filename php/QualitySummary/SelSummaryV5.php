<?php
  /* 21/08/08作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  $machine = $_POST['machine'];
  if ($machine == 0) {
    $add = "";
  } else {
    $add = " AND press_machine_no LIKE '$machine'";
  };
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

      $prepare = $dbh->prepare("SELECT 
    t_press.id,
    DATE_FORMAT(t_press.press_date_at, '%m-%d') AS prs_d,
    m_dies.die_number,
    m_pressing_type.pressing_type,
    t_press_directive.billet_input_quantity,
    IFNULL(CONCAT(ROUND(t30.prs_quantity / t_press.billet_length, 1), 'x', t_press.billet_length), CONCAT(t30.ttqt, 'x', t_press.billet_length))  AS blq,
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
	DATE_FORMAT(t_press.aging_check_date, '%m-%d'),
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
	t_press.special_note
FROM t_press
LEFT JOIN m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
LEFT JOIN t_press_directive ON t_press_directive.id = t_press.press_directive_id
LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
LEFT JOIN t_press_sub ON t_press.id = t_press_sub.press_id
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
        t_bundle.press_id, SUM(t_bundle.quantity * t_bundle.len) AS prs_quantity, SUM(t_bundle.quantity) AS ttqt
    FROM
        t_bundle
    GROUP BY t_bundle.press_id) t30 ON t30.press_id = t_press.id
WHERE m_dies.die_number LIKE :die_number $add
GROUP BY t_press.id
ORDER BY 	t_press.press_date_at DESC, t_press.press_start_at DESC
LIMIT 400
    ");

      $prepare->bindValue(':die_number', $_POST["die_number"], PDO::PARAM_STR);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
