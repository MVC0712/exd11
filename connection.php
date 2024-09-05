<?php
require_once("config.php");
class DBHandler {
    private $db;
    function __construct() {
        $this->connect_database();
    }
    public function getInstance() {
        return $this->db;
    }
    private function connect_database() {
        try {
            $connection_string = DRIVER.':host='.HOST.';dbname='.DBNAME.';charset=utf8';
            $connection_array = array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            );
            $this->db = new PDO($connection_string, USER, PASSWORD, $connection_array);
        }
        catch(PDOException $e) {
            $this->db = null;
        }
    }   
}
?>