<?php
	/*获取管理员列表*/
	include("../inc/init.php");
	require_once(MODEL_PATH . "admin.eclass.php");

	$tb_admin = "tb_admin";
	$admin = $_GET['admin'];
	
	$dbTool = new MysqlDBTool($host, $uname, $pwd, $dbname);
	$adminObj = new Admin($dbTool, $tb_admin);
	
	//待返回对象
	$rspRes = array("isSuc" =>0, "adminList" => null);
	
	$adminList = $adminObj->retriAdminInfoExcept($admin);
	if(count($adminList) >=0 ){
			$rspRes['isSuc'] = 1;
			$rspRes['adminList'] = $adminList;
	}
	
	echo json_encode($rspRes);