<?php
  $updir = "../../FileUpload/DailyReport";
  $tmp_file = @$_FILES['file']['tmp_name'];
  $filepath = pathinfo($_FILES['file']['name']);
  // print_r($_POST['sub_name']);
  $sub_name = $_POST['sub_name'];
  if ( 0 < $_FILES['file']['error'] ) {
    echo 'Error: ' . $_FILES['file']['error'] . '<br>';
  }else {
    move_uploaded_file($_FILES['file']['tmp_name'], "$updir" . "/" .$sub_name.$_FILES['file']['name']);
  }
?>