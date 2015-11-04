<?php
	/*请求撤销任务完成
	  *如果是接收者,需要处理冲突：如果创建者已经删除任务，接受者不能更新撤销任务的完成状态
	  */
	include("../inc/init.php");
	include( MODEL_PATH . "memoTask.eclass.php");

	$tb_task = "tb_memo_task";

	$dbTool = new MysqlDBTool($host, $uname, $pwd, $dbname);
	$mt = new MemoTask($dbTool, $tb_task);
	
	$taskNo = $_GET['taskNo'];		//待撤销完成状态的任务
	$iIsReciver = intval($_GET['iIsReciver']);		//是否接收者

	//响应数据
	//isSuc=0 && confilctNo=0  "系统繁忙"
	//isSuc=0 && conflictNo=2  "创建者已经删除任务" 
	//isSuc=1 && conflictNo=0	 "更新成功"
	$bRetVal = false;
	$rspRes = array("isSuc" => 0, "conflictNo" => 0);
	
	//(接受者冲突检测)
	if( 1 == $iIsReciver && !$mt->isReciverCanContinue($taskNo)){
			$rspRes['conflictNo'] = 2;
			echo json_encode($rspRes);
			exit;
	}

	//撤销任务完成
	$bRetVal = $mt->taskUnDone($taskNo);
	if($bRetVal){
			$rspRes['isSuc'] = 1;
	}
	echo json_encode($rspRes);
	//var_dump($bRetVal);