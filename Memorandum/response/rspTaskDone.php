<?php
	/*请求任务完成
	  *如果是接收者,需要处理冲突：如果创建者已经删除或者收回任务，接受者不能完成任务
	  *文件锁的操作
	  */
	include("../inc/init.php");
	include( MODEL_PATH .  "memoTask.eclass.php" );

	$host = "localhost";
	$uname = "root";
	$pwd = "mysql";
	$dbname = "memorandum";
	$tb_task = "tb_memo_task";

	$dbTool = new MysqlDBTool($host, $uname, $pwd, $dbname);
	$mt = new MemoTask($dbTool, $tb_task);
	
	$taskNo = $_GET['taskNo'];		//待完成的任务
	$solver = $_GET['solver'];		//完成者
	$iIsReciver = intval($_GET['iIsReciver']);

	//响应数据
	//isSuc=0 && confilctNo=0  "系统繁忙"
	//isSuc=0 && conflictNo=2  "创建者已经删除或收回任务" 
	//isSuc=1 && conflictNo=0	 "更新成功"
	$bRetVal = false;
	$rspRes = array("isSuc" => 0, "conflictNo" => 0);
	
	//(接收者)冲突检测
	if( 1 == $iIsReciver && !$mt->isReciverCanContinue($taskNo)){
			$rspRes['conflictNo'] = 2;
			echo json_encode($rspRes);
			exit;
	}

	$bRetVal = $mt->taskDone($taskNo, $solver);
	if($bRetVal){
			$rspRes['isSuc'] = 1;
	}
	echo json_encode($rspRes);