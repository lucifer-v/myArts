<?php
	/*请求删除任务*/
	include("../inc/init.php");
	include( MODEL_PATH . "memoTask.eclass.php" );
	include( MODEL_PATH . "memoTaskassign.eclass.php");

	$tb_task = "tb_memo_task";
	$tb_taskassign = "tb_memo_taskassign";
	
	$taskNo = $_GET['taskNo'];

	$dbTool = new MysqlDBTool($host, $uname, $pwd, $dbname);
	$mt = new MemoTask($dbTool, $tb_task);
	$mta = new MemoTaskAssign($dbTool, $tb_taskassign);

	//响应结果
	$bRetVal = false;
	$rspRes = array("isSuc" => 0);
	$bRetVal = $mt->deleteTask($mta, $taskNo);

	if($bRetVal){
			$rspRes['isSuc'] = 1;
	}

	echo json_encode($rspRes);