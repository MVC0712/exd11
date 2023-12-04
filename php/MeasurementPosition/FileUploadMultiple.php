<?php
$upload_location = "../../../upload/Measurent/";
$countfiles = count($_FILES['files']['name']);

$count = 0;
for($i=0;$i < $countfiles;$i++){
  $filename = $_FILES['files']['name'][$i];
  $path = $upload_location.$filename;
  $file_extension = pathinfo($path, PATHINFO_EXTENSION);
  $file_extension = strtolower($file_extension);
  $valid_ext = array("pdf","doc","docx","jpg","png","jpeg");
  if(in_array($file_extension,$valid_ext)){
    if(move_uploaded_file($_FILES['files']['tmp_name'][$i],$path)){
      $count += 1;
    } 
  }
}
echo $count;
exit;