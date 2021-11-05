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

    $prepare = $dbh->prepare("

      SELECT 
        m_ordersheet.id AS ordersheet_id,
        m_ordersheet.ordersheet_number,
        m_ordersheet.delivery_date_at,
        m_ordersheet.issue_date_at,
        m_production_numbers.production_number,
        m_ordersheet.production_quantity,
        m_ordersheet.updated_at
      FROM m_ordersheet
      LEFT JOIN m_production_numbers ON m_ordersheet.production_numbers_id = m_production_numbers.id
      ORDER BY m_ordersheet.delivery_date_at DESC

    ");
    $prepare->execute();
    $result = $prepare->fetchALL(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
