<?php
  $userid = "webuser";
  $passwd = "";

  $data = "";
  $press_id = "";

  $data = $_POST['data'];
  $press_id = $_POST['press_id'];
  $etching_finish = $_POST['etching_finish'];
  $etching_staff = $_POST['etching_staff'];
  $etching_check_staff = $_POST['etching_check_staff'];
  $file_url = $_POST['file_url'];
  $image_url = $_POST['image_url'];
  $data_json = json_decode($data);

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
        foreach ($data_json as $val) {
            $sql_paramater[] = "({$press_id}, '{$val[0]}', {$val[2]}, {$val[3]}, {$val[4]}, {$val[5]}, {$val[6]}, {$val[7]}, {$val[8]}, {$val[9]}, {$val[10]}, {$val[11]})";
        };

      $sql = "INSERT INTO t_etching ";
      $sql = $sql."(press_id, Position, 1st_jug, 1st_code, 2nd_jug, 2nd_code, 3rd_jug, 3rd_code, 4th_jug, 4th_code, 5th_jug, 5th_code ) VALUES ";
      $sql = $sql.join(",", $sql_paramater);
      $prepare = $dbh->prepare($sql);
      $prepare->execute();

      $sql1 = "INSERT INTO t_press_sub (press_id, etching_finish, etching_staff, etching_check_staff, etching_file_url, etching_image_url) VALUES 
                                      ('{$press_id}','{$etching_finish}', '{$etching_staff}','{$etching_check_staff}','{$file_url}','{$image_url}')";
      $prepare = $dbh->prepare($sql1);
      $prepare->execute();

      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
