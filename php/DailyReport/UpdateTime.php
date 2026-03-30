<?php
  $userid = "webuser";
  $passwd = "";

  // Lấy dữ liệu từ POST
  $id = $_POST['id'];

  $time_start = $_POST['time_start'];
  $time_end = $_POST['time_end'];

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

    // Dùng prepared statement an toàn hơn
    $sql = "UPDATE t_time_press
              SET 
                time_start = :time_start,
                time_end = :time_end
            WHERE id = :id";

    $prepare = $dbh->prepare($sql);
    $prepare->bindValue(':time_start', $time_start, PDO::PARAM_STR);
    $prepare->bindValue(':time_end', $time_end, PDO::PARAM_STR);
    $prepare->bindValue(':id', $id, PDO::PARAM_INT);
    $prepare->execute();

    echo json_encode("UPDATED");
  } catch (PDOException $e) {
    $error = $e->getMessage();
    echo json_encode($error);
  }

  $dbh = null;
?>
