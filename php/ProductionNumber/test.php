<?php
  $arrayValues = array();

  
  foreach ($_POST as $record) {
      $production_number   = $record['production_number'];
      $category2_id = $record['category2_id'];
      $create_at = date("Y-m-d");
      $arrayValues[] = "('{$production_number}', '{$category2_id}', '{$create_at}')";
  }

  $sql = "INSERT INTO m_production_number (production_number, production_category2_id, created_at) VALUES " 
        .join(",", $arrayValues);

?>
