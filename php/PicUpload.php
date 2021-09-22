<?php
  // 21/2/21 受け取ったファイルを
  // 所定の位置にファイルコピー、ファイル名の変更
  // $file_size_limit = 1024 * 1024;
  $updir = "../../../upload";
  $updir = ".";
  $tmp_file = @$_FILES['upfile']['tmp_name'];
  $filepath = pathinfo($_FILES['upfile']['name']);
  $copy_file = date("Ymd-His") . "." . $filepath['extension'];

  if($_FILES['upfile']['error'] == 2){
    echo "Too Big file";
  }elseif (is_uploaded_file($_FILES["upfile"]["tmp_name"])) {
    if (move_uploaded_file($tmp_file, "$updir" . "/" . "$copy_file")) {
      chmod("$updir" . "/" . "$copy_file", 0644);
      // echo "\n";
      // echo $_FILES["upfile"]["name"];
      echo $copy_file;
    } else {
      echo "sorry fault to upload file";
    }
  } else {
    echo "please, select photo file";
  }
?>