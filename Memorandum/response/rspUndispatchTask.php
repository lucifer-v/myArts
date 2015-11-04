<?php
	/*收回已经派遣的任务
	  *需要处理冲突：当接收者已经完成消息时，创建这不能再收回任务
	  */
	include("../inc/init.php");
	include( MODEL_PATH . "memoTask.eclass.php");
	include( MODEL_PATH . "memoTaskassign.eclass.php");

	$tb_task = "tb_memo_task";
	$tb_taskassign = "tb_memo_taskassign";
	
	$taskNo = $_GET['taskNo'];
	$othReciver = $_GET['othReciver'];

	$dbTool = new MysqlDBTool($host, $uname, $pwd, $dbname);
	$mt = new MemoTask($dbTool, $tb_task);
	$mta = new MemoTaskAssign($dbTool, $tb_taskassign);

	//响应结果
	// isSuc =0 && conflictNo = 0 "系统繁忙"
	// isSuc = 0 && conflictNo =1 "接收者已经完成任务"
	// isSuc =1 && conflictNo = 0 "撤回任务成功"
	$bRetVal = false;
	$rspRes = array("isSuc" => 0, "conflictNo" => 0);

	/*检测操作冲突*/
	if( !$mt->isCreatorCanContinue($taskNo) ){		//如果接收者已经完成任务
			$rspRes['conflictNo'] = 1;
			echo json_encode($rspRes);
			exit;
	}
	
	//撤回派遣任务
	$bRetVal = $mt->unassignTask($mta, $taskNo, $othReciver);

	if($bRetVal){
			$rspRes['isSuc'] = 1;
	}
	echo json_encode($rspRes);