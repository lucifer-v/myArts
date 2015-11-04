<?php
	/*按主题内容查询消息*/
	include("../inc/init.php");
	include( MODEL_PATH . "memoTask.eclass.php");
	include( MODEL_PATH . "memoTaskassign.eclass.php");

	$tb_task = "tb_memo_task";
	$tb_taskassign = "tb_memo_taskassign";

	$dbTool = new MysqlDBTool($host, $uname, $pwd, $dbname);
	$mt =new MemoTask($dbTool, $tb_task);
	$mta = new MemoTaskassign($dbTool, $tb_taskassign);

	$reciver = $_GET['reciver'];
	$srhContent = $_GET['srhContent'];
	
	$taskSet = $mt->retriTaskByRcvrAndSubject($reciver, $srhContent);		//获取任务集
	$mta->attachTaskTypeFlag($taskSet);			//添加任务类型标识
	$mta->attachTaskOptList($taskSet);				//添加任务操作集合
	$mta->attachTaskCreateTime($taskSet);		//添加任务创建时间

	//返回数据
	$rspRes = array("isSuc" => 0, "taskSet" => "");
	if(count($taskSet) > 0){
			$rspRes['isSuc'] = 1;
			$rspRes['taskSet'] = $taskSet;
	}
	echo json_encode($rspRes);