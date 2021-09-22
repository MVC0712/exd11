<?php
  /* 21/05/19作成 */
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
        m_ordersheet.delivery_date_at,
        m_ordersheet.issue_date_at,
        m_ordersheet.ordersheet_number,
        m_production_numbers.id AS production_number_id,
        m_production_numbers.production_number,
        m_ordersheet.production_quantity,
        IFNULL(m_ordersheet.updated_at, '') AS update_at
      FROM m_ordersheet
      LEFT JOIN m_production_numbers ON m_ordersheet.production_numbers_id = m_production_numbers.id
      WHERE m_ordersheet.id = :targetId
    ");

    $prepare->bindValue(':targetId', $_POST["targetId"], (INT)PDO::PARAM_INT); 
    $prepare->execute();
    $result = $prepare->fetch(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e){
    $error = $e->getMessage();
    echo json_encode($error);
  }
  $dbh = null;
?>
