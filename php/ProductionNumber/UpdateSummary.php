<?php
  /* 21/03/22作成 */
  $userid = "webuser";
  $passwd = "";
//  $data_json = json_decode($data); 
//  $data_json = array_values($data_json); //配列の並び替え
  // print_r($_POST);
  // print_r("<br>");
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

update m_production_numbers
  set 

    aging_type_id = :aging_type_id,
    billet_material_id = :billet_material_id,
    circumscribed_circle = :circumscribed_circle,
    cross_section_area = :cross_section_area,
    drawn_department = :drawn_department,
    packing_quantity = :packing_quantity,
    production_category2_id = :production_category2_id,
    production_length = :production_length,
    production_number = :production_number,
    specific_weight = :specific_weight,
    updated_at = :updated_at

  WHERE id = :id


    ");

$prepare->bindValue(':aging_type_id', (INT)$_POST['aging_type_id'], PDO::PARAM_INT);
$prepare->bindValue(':billet_material_id', (INT)$_POST['billet_material_id'], PDO::PARAM_INT);
// $prepare->bindValue(':circumscribed_circle', $_POST['circumscribed_circle'], PDO::PARAM_STR);
$prepare->bindValue(':cross_section_area', $_POST['cross_section_area'], PDO::PARAM_STR);
// $prepare->bindValue(':drawn_department', (INT)$_POST['drawn_department'], PDO::PARAM_INT);
$prepare->bindValue(':packing_quantity', (INT)$_POST['packing_quantity'], PDO::PARAM_INT);
$prepare->bindValue(':production_category2_id', (INT)$_POST['production_category2_id'], PDO::PARAM_INT);
$prepare->bindValue(':production_length', $_POST['production_length'], PDO::PARAM_STR);
$prepare->bindValue(':production_number', $_POST['production_number'], PDO::PARAM_STR);
$prepare->bindValue(':specific_weight', $_POST['specific_weight'], PDO::PARAM_STR);
$prepare->bindValue(':updated_at', $_POST['updated_at'], PDO::PARAM_STR);
$prepare->bindValue(':id', (INT)$_POST['targetId'], PDO::PARAM_INT);

    if($_POST['circumscribed_circle'] == '')
      $prepare->bindValue(':circumscribed_circle', Null, PDO::PARAM_STR);
    else
      $prepare->bindValue(':circumscribed_circle', $_POST['circumscribed_circle'], PDO::PARAM_STR);

      if((INT)$_POST['drawn_department'] == 0)
      $prepare->bindValue(':drawn_department', Null, PDO::PARAM_STR);
    else
      $prepare->bindValue(':drawn_department', $_POST['drawn_department'], PDO::PARAM_STR);



    // print_r($sql);
    $prepare->execute();

    echo json_encode("Updated");
  } catch (PDOException $e){
    $error = $e->getMessage();
    print_r($error);
  }
  $dbh = null;
?>
