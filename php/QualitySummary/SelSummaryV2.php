<?php
  /* 21/08/08作成 */
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
          m_dies.die_number,
          t_press.press_date_at,
          t30.dies_fix,
          '' AS change_condision,
          m_pressing_type.pressing_type,
          t_press.plan_billet_quantities,
          t_press.actual_billet_quantities,
          t20.work_quantity,
          t10.total_ng,
          t20.work_quantity - t10.total_ng AS total_ok,
          DATE_FORMAT(t_press.dimension_check_date, '%m-%d') AS dim_check_date,
          DATE_FORMAT(t_press.etching_check_date, '%m-%d') AS etching_check_date,
          DATE_FORMAT(t_press.aging_check_date, '%m-%d') AS aging_check_date,
          DATE_FORMAT(t_press.packing_check_date, '%m-%d') AS packing_date,
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
          t10.code_351
        FROM t_press
        LEFT JOIN m_pressing_type ON t_press.pressing_type_id = m_pressing_type.id
        LEFT JOIN m_dies ON t_press.dies_id = m_dies.id
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
              SUM(CASE WHEN m_quality_code.quality_code = 351 THEN t_press_quality.ng_quantities ELSE 0 END) AS code_351
            FROM t_using_aging_rack
            LEFT JOIN t_press_quality ON t_press_quality.using_aging_rack_id = t_using_aging_rack.id
            LEFT JOIN m_quality_code ON t_press_quality.quality_code_id = m_quality_code.id
            GROUP BY t_using_aging_rack.t_press_id
          ) t10 ON t10.t_press_id = t_press.id 
        LEFT JOIN 
          (
            SELECT 
              t_using_aging_rack.t_press_id,
              SUM(t_using_aging_rack.work_quantity) AS work_quantity
            FROM t_using_aging_rack
            GROUP BY 	t_using_aging_rack.t_press_id
          ) t20 ON t20.t_press_id = t_press.id
        LEFT JOIN 
          (
            SELECT 
              t20.t_press_id,
              (
                SELECT
                  case
                    when COUNT(*) then 'Yes'
                    ELSE ''
                  END AS dies_fix
                FROM
                  t_dies_status
                WHERE
                  t_dies_status.do_sth_at BETWEEN t10.press_date_at AND t20.press_date_at
                  AND t_dies_status.dies_id = t20.dies_id
                  AND t_dies_status.die_status_id IN (7, 9)
              ) AS dies_fix
            FROM (
              SELECT 
                t1.id AS t_press_id,
                t1.dies_id,
                t1.press_date_at,
                (
                  SELECT COUNT(*)
                  FROM t_press AS t2
                  WHERE 
                    t2.dies_id = t1.dies_id
                    AND 
                    t2.press_date_at > t1.press_date_at
                ) + 1 AS rank	
              FROM t_press AS t1
            ) t10 INNER JOIN (
              SELECT 
                t1.id AS t_press_id,
                t1.dies_id,
                t1.press_date_at,
                (
                  SELECT COUNT(*)
                  FROM t_press AS t2
                  WHERE 
                    t2.dies_id = t1.dies_id
                    AND 
                    t2.press_date_at > t1.press_date_at
                ) + 1 AS rank	
              FROM t_press AS t1
            ) t20
            ON t10.dies_id = t20.dies_id AND t10.rank = t20.rank + 1
            ORDER BY t_press_id DESC	
          ) AS t30 ON t30.t_press_id = t_press.id
        ORDER BY 	t_press.press_date_at DESC, t_press.press_start_at
        LIMIT 300
      ";

      $prepare = $dbh->prepare($sql);

      // $prepare->bindValue(':die_number', $_POST["die_number"], PDO::PARAM_STR);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
