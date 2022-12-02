<?php
  $userid = "webuser";
  $passwd = "";

  $staff_id = "";
  $check_at = "";
  $vl6061_1200 = "";
  $vl6061_600 = "";
  $vl6063_1200 = "";
  $vl6063_600 = "";
  $vl6N01_1200 = "";
  $vl6N01_600 = "";
  $vl6N01A_1200 = "";
  $vl6N01A_600 = "";

  $staff_id = $_POST['staff_id'];
  $check_at = $_POST['check_at'];
  $vl6061_1200 = $_POST['vl6061_1200'];
  $vl6061_600 = $_POST['vl6061_600'];
  $vl6063_1200 = $_POST['vl6063_1200'];
  $vl6063_600 = $_POST['vl6063_600'];
  $vl6N01_1200 = $_POST['vl6N01_1200'];
  $vl6N01_600 = $_POST['vl6N01_600'];
  $vl6N01A_1200 = $_POST['vl6N01A_1200'];
  $vl6N01A_600 = $_POST['vl6N01A_600'];

  $vl6061_1200_vn = $_POST['vl6061_1200_vn'];
  $vl6061_600_vn = $_POST['vl6061_600_vn'];
  $vl6063_1200_vn = $_POST['vl6063_1200_vn'];
  $vl6063_600_vn = $_POST['vl6063_600_vn'];
  $vl6N01A_1200_vn = $_POST['vl6N01A_1200_vn'];
  $vl6N01A_600_vn = $_POST['vl6N01A_600_vn'];
  try {
      $dbh = new PDO(
          'mysql:host=localhost; dbname=extrusion; charset=utf8',
          $userid,
          $passwd,
          array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
          )
      );

      $sql = "INSERT INTO t_checkbillet 
                (staff_id, check_at, A6061228600, A60612281200, A6063228600, A60632281200, A6N01228600, A6N012281200, A6N01A228600, A6N01A2281200, 
                A6061228600_vn, A60612281200_vn, A6063228600_vn, A60632281200_vn, A6N01A228600_vn, A6N01A2281200_vn
            ) VALUES (
                '$staff_id', '$check_at', '$vl6061_600', '$vl6061_1200', '$vl6063_600', '$vl6063_1200', '$vl6N01_600', '$vl6N01_1200', '$vl6N01A_600', '$vl6N01A_1200',
                '$vl6061_600_vn', '$vl6061_1200_vn', '$vl6063_600_vn', '$vl6063_1200_vn', '$vl6N01A_600_vn', '$vl6N01A_1200_vn'
            )";
            
      $prepare = $dbh->prepare($sql);
      $prepare->execute();
      echo json_encode("INSERTED");
      } catch (PDOException $e) {
          $error = $e->getMessage();
          print_r($error);
      }
  $dbh = null;
  