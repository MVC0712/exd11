<?php
  $updir = "../../../upload/Production_drawing";
  $tmp_file = @$_FILES['file']['tmp_name'];
  $filepath = pathinfo($_FILES['file']['name']);

  if ( 0 < $_FILES['file']['error'] ) {
    echo 'Error: ' . $_FILES['file']['error'] . '<br>';
  }else {
    move_uploaded_file($_FILES['file']['tmp_name'], "$updir" . "/" . str_replace('#', '', $_FILES['file']['name']));
  }
?>