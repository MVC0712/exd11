<?php
  /* 21/06/14作成 */
  $userid = "webuser";
  $passwd = "";
//  $data_json = json_decode($data);
//  $data_json = array_values($data_json); //配列の並び替え
  // print_r($_POST);
  // print_r("<br>");
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

      switch ($_POST['columnNumber']) {
        case 1:
          // print_r('case 1');
          $sql = "UPDATE m_quality_code SET quality_code = :value WHERE id = :id";
          break;
        case 2:
          // print_r('case 2');
          $sql = "UPDATE m_quality_code SET description_vn = :value WHERE id = :id";
          break;
        case 3:
          // print_r('case 3');
          $sql = "UPDATE m_quality_code SET description_jp = :value WHERE id = :id";
          break;
        case 4:
          // print_r('case 4');
          $sql = "UPDATE m_quality_code SET description_cn = :value WHERE id = :id";
          break;
        default:
          print_r('default');
        }
      $prepare = $dbh->prepare($sql);
      $prepare->bindValue(':value', $_POST['value'], PDO::PARAM_STR);
      $prepare->bindValue(':id', (INT)$_POST['id'], PDO::PARAM_INT);

      $prepare->execute();

      echo json_encode("INSERTED");
  } catch (PDOException $e) {
      $error = $e->getMessage();
      print_r($error);
  }
  $dbh = null;
