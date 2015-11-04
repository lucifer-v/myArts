<?php
	/*请求"任务完成"信息*/
	include("../inc/init.php");
	include( MODEL_PATH .  "memoTask.eclass.php" );

	$tb_name = "tb_memo_task";

	$dbTool = new MysqlDBTool($host, $uname, $pwd, $dbname);
	$mt =new MemoTask($dbTool, $tb_name);

	$firstDate = $_GET['firstDate'];
	$lastDate = $_GET['lastDate'];
	$reciver = $_GET['reciver'];

	//获取firstDate--lastDate之间某人的任务处理信息
	$taskCompInfo = $mt->retriTaskCompleteInfo($firstDate, $lastDate, $reciver);
	//获取reciver在firstDate之前是否有没有完成的任务
	$undoneFlag = ($mt->existTaskUnDone($firstDate, $reciver) == true ) ? 1 : 0 ;
		
	$rspRes = array();
	$rspRes['undoneFlag'] = $undoneFlag;
	$rspRes['taskCompInfo'] = $taskCompInfo;

	echo json_encode($rspRes);
	//var_dump($rspRes);