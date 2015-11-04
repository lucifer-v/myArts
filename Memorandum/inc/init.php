<?php
	error_reporting(E_ALL);
	date_default_timezone_set("asia/shanghai");
	
	//定义路径常量
	define("ROOT", str_replace( '\\', '/', dirname(dirname(__FILE__))."/") );
	define("MODEL_PATH", ROOT."model/");

	require_once("mysqlDBTool.tclass.php");
	
	//定义数据库信息
	$host = "localhost";
	$uname = "root";
	$pwd = "mysql";
	$dbname = "memorandum";