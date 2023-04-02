<?php
  $arrayValues = array();
  $queryValues = array();
  $bindValues = array();

  foreach ($_POST as $record) {
      $production_number   = $record['production_number'];
      $category2_id = $record['category2_id'];
      $create_at = date("Y-m-d");
      $arrayValues[] = "(?, ?, ?)";
      $queryValues[] = $production_number;
      $queryValues[] = $category2_id;
      $queryValues[] = $create_at;
      $bindValues[] = 's'; // production_number は文字列なので 's' を指定
      $bindValues[] = 'i'; // category2_id は整数なので 'i' を指定
      $bindValues[] = 's'; // created_at は文字列なので 's' を指定
  }

  print_r($arrayValues);

  $sql = "INSERT INTO m_production_numbers (production_number, production_category2_id, created_at) VALUES " 
        .join(",", $arrayValues);
  
  $mysqli = new mysqli("localhost", "webuser", "", "extrusion");

  $stmt = $mysqli->prepare($sql);
  
  // パラメータを bind_param() で指定
  $param_arr = array_merge($bindValues, $queryValues);
  $bind_params = array();
  for ($i = 0; $i < count($param_arr); $i++) {
    $bind_params[] = &$param_arr[$i];
  }
  call_user_func_array(array($stmt, 'bind_param'), $bind_params);

  $stmt->execute();

  $stmt->close();
  $mysqli->close();
?>