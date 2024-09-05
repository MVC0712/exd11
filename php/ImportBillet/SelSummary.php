<?php
  /* 21/05/17作成 */
  $userid = "webuser";
  $passwd = "";
  // print_r($_POST);
  
  try{
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
      t_import_billet.id,
      t_import_billet.lot,
      t_import_billet.bundle,
      t_import_billet.quantity,
      m_billet_size.billet_size,
      m_billet_material.billet_material,
      t_import_billet.length,
      CASE t_import_billet.mfg
          WHEN 1 THEN 'Dubai'
          WHEN 2 THEN 'VN'
          ELSE 'SAI'
      END AS mfg
    FROM
      t_import_billet
          LEFT JOIN
      m_billet_material ON m_billet_material.id = t_import_billet.billet_material_id
          LEFT JOIN
      m_billet_size ON m_billet_size.id = t_import_billet.billet_size_id");
    $prepare->execute();
    $result = $prepare->fetchALL(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
