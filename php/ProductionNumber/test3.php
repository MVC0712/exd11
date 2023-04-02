<?php
$query = [];  //execute
$param = [];  //prepare

//組み立て
foreach($_POST as $val)
{
    //パラメータ数に合わせて文字列を用意
    $query[] = '(?, ?, ?)';
    
    //実行の際に食わせるパラメータ
    $param[] = $val['production_number'];
    $param[] = $val['category2_id'];
    $param[] = date("Y-m-d");
}

//SQL
$sql  = 'INSERT INTO m_production_numbers (production_number, category2_id, created_at) VALUES ';
$sql .= implode(', ', $query);


$dbh = new mysqli("localhost", "webuser", "", "extrusion");

//実行
$sth = $dbh->prepare($sql);
$sth->execute($param);

?>