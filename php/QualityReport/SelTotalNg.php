<?php
  /* 21/07/26作成 */
  $userid = "webuser";
  $passwd = "";
//   print_r($_POST);
  
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

      $prepare = $dbh->prepare("
        SELECT 
          SUM(t1.ng_quantities) AS total_ng,
          SUM(CASE WHEN t1.quality_code = 301 THEN t1.ng_quantities ELSE 0 END) AS code_301,
          SUM(CASE WHEN t1.quality_code = 301 THEN t1.ng_quantities ELSE 0 END) AS code_301,
          SUM(CASE WHEN t1.quality_code = 302 THEN t1.ng_quantities ELSE 0 END) AS code_302,
          SUM(CASE WHEN t1.quality_code = 303 THEN t1.ng_quantities ELSE 0 END) AS code_303,
          SUM(CASE WHEN t1.quality_code = 304 THEN t1.ng_quantities ELSE 0 END) AS code_304,
          SUM(CASE WHEN t1.quality_code = 305 THEN t1.ng_quantities ELSE 0 END) AS code_305,
          SUM(CASE WHEN t1.quality_code = 306 THEN t1.ng_quantities ELSE 0 END) AS code_306,
          SUM(CASE WHEN t1.quality_code = 307 THEN t1.ng_quantities ELSE 0 END) AS code_307,
          SUM(CASE WHEN t1.quality_code = 308 THEN t1.ng_quantities ELSE 0 END) AS code_308,
          SUM(CASE WHEN t1.quality_code = 309 THEN t1.ng_quantities ELSE 0 END) AS code_309,
          SUM(CASE WHEN t1.quality_code = 310 THEN t1.ng_quantities ELSE 0 END) AS code_310,
          SUM(CASE WHEN t1.quality_code = 311 THEN t1.ng_quantities ELSE 0 END) AS code_311,
          SUM(CASE WHEN t1.quality_code = 312 THEN t1.ng_quantities ELSE 0 END) AS code_312,
          SUM(CASE WHEN t1.quality_code = 313 THEN t1.ng_quantities ELSE 0 END) AS code_313,
          SUM(CASE WHEN t1.quality_code = 314 THEN t1.ng_quantities ELSE 0 END) AS code_314,
          SUM(CASE WHEN t1.quality_code = 315 THEN t1.ng_quantities ELSE 0 END) AS code_315,
          SUM(CASE WHEN t1.quality_code = 316 THEN t1.ng_quantities ELSE 0 END) AS code_316,
          SUM(CASE WHEN t1.quality_code = 317 THEN t1.ng_quantities ELSE 0 END) AS code_317,
          SUM(CASE WHEN t1.quality_code = 318 THEN t1.ng_quantities ELSE 0 END) AS code_318,
          SUM(CASE WHEN t1.quality_code = 319 THEN t1.ng_quantities ELSE 0 END) AS code_319,
          SUM(CASE WHEN t1.quality_code = 320 THEN t1.ng_quantities ELSE 0 END) AS code_320,
          SUM(CASE WHEN t1.quality_code = 321 THEN t1.ng_quantities ELSE 0 END) AS code_321,
          SUM(CASE WHEN t1.quality_code = 322 THEN t1.ng_quantities ELSE 0 END) AS code_322,
          SUM(CASE WHEN t1.quality_code = 323 THEN t1.ng_quantities ELSE 0 END) AS code_323,
          SUM(CASE WHEN t1.quality_code = 324 THEN t1.ng_quantities ELSE 0 END) AS code_324,
          SUM(CASE WHEN t1.quality_code = 351 THEN t1.ng_quantities ELSE 0 END) AS code_351
        FROM
        (
          SELECT
            m_quality_code.quality_code,
            SUM(t_press_quality.ng_quantities) AS ng_quantities
          FROM t_using_aging_rack
          LEFT JOIN t_press_quality ON t_press_quality.using_aging_rack_id = t_using_aging_rack.id
          LEFT JOIN m_quality_code ON t_press_quality.quality_code_id = m_quality_code.id
          WHERE t_using_aging_rack.t_press_id = :press_id
          GROUP BY 	m_quality_code.quality_code
        ) t1
      ");

      $prepare->bindValue(':press_id', (INT)$_POST["press_id"], PDO::PARAM_INT);
      $prepare->execute();
      $result = $prepare->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($result);
  } catch (PDOException $e) {
      $error = $e->getMessage();
      echo json_encode($error);
  }
  $dbh = null;
