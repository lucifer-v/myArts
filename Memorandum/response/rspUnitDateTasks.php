<?php
	/*请求选定日期的任务列表
	  *同时实时获取当日的任务完成情况信息
	  *在打开页面，或者切换日历时，发送的请求
	*/
	include("../inc/init.php");
	include( MODEL_PATH . "memoTask.eclass.php");
	include( MODEL_PATH .  "memoTaskassign.eclass.php");

	$tb_task = "tb_memo_task";
	$tb_taskassign = "tb_memo_taskassign";
	
	$dbTool = new MysqlDBTool($host, $uname, $pwd, $dbname);
	$mt = new MemoTask($dbTool, $tb_task);
	$mta = new MemoTaskAssign($dbTool, $tb_taskassign);

	$reciver = $_GET['reciver'];
	$dateStr = $_GET['dateStr'];

	//响应数据
	$rspRes = array('taskSet' => null, 'taskCompInfo' => null);

	$taskSet = $mt->retriTaskByRcvrAndDate($reciver, $dateStr);		//获取任务
	$mta->attachTaskTypeFlag($taskSet);
	$mta->attachTaskOptList($taskSet);
	$mta->attachTaskCreateTime($taskSet);
	$rspRes['taskSet'] = $taskSet;

	//任务完成信息
	$taskCompInfo = $mt->retriTaskCompleteInfo($dateStr, $dateStr, $reciver);
	$rspRes['taskCompInfo'] = $taskCompInfo;
	
	echo json_encode($rspRes);
	//var_dump($taskSet);