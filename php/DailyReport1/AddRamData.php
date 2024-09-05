<?php
  $userid = "webuser";
  $passwd = "";

  $press_id = $_POST['press_id'];
  $number = $_POST['number'];
  $ram_1000_speed = $_POST['ram_1000_speed'];
  $ram_1000_pressure = $_POST['ram_1000_pressure'];
  $work_1000_temperature = $_POST['work_1000_temperature'];
  $ram_200_speed = $_POST['ram_200_speed'];
  $ram_200_pressure = $_POST['ram_200_pressure'];
  $work_200_temperature = $_POST['work_200_temperature'];

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

      $sql = "INSERT INTO t_press_sub_data (
        press_id, number, 1000_ram_speed, 1000_ram_pressure, 1000_work_temperature, 
        200_ram_speed, 200_ram_pressure, 200_work_temperature) VALUES
       (
          '$press_id', '$number', '$ram_1000_speed', '$ram_1000_pressure', '$work_1000_temperature',
          '$ram_200_speed', '$ram_200_pressure', '$work_200_temperature'
      )";
      $prepare = $dbh->prepare($sql);
      
      $prepare->execute();
      echo json_encode("INSERTED");
      } catch (PDOException $e) {
          $error = $e->getMessage();
          print_r($error);
      }
  $dbh = null;
  