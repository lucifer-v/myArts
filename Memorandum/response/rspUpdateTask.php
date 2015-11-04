<?php
	/*更新任务内容
	  *如果是接收者,需要处理冲突：如果创建者已经删除或者收回任务，接受者不能更新任务内容
	*/
	include("../inc/init.php");
	include( MODEL_PATH . "memoTask.eclass.php");

	$tb_task = "tb_memo_task";
	
	$taskNo = $_GET['taskNo'];
	$subject = $_GET['subject'];
	$comments = $_GET['comments'];
	$iIsReciver = intval($_GET['iIsReciver']);

	$dbTool = new MysqlDBTool($host, $uname, $pwd, $dbname);
	$mt = new MemoTask($dbTool, $tb_task);
	
	//设置待更新选项
	$mt->clear();
	$mt->m_taskNo = $taskNo;
	$mt->m_subject = $subject;
	$mt->m_comments = $comments;
	$mt->m_lastModifyDate = time();

	//响应数据
	//isSuc=0 && confilctNo=0  "系统繁忙"
	//isSuc=0 && conflictNo=2  "创建者已经删除或收回任务" 
	//isSuc=1 && conflictNo=0	 "更新成功"
	$bRetVal = false;
	$rspRes = array("isSuc" => 0, "conflictNo"=> 0);
	
	//接收者操作冲突检测
	if( 1 == $iIsReciver &&  !$mt->isReciverCanContinue($taskNo) ){		//如果创建这已经收回
			$rspRes['conflictNo'] = 2;
			echo json_encode($rspRes);
			exit;
	}
	
	//更新操作成功
	$bRetVal =$mt->updateTask();
	if($bRetVal){
			$rspRes['isSuc'] = 1;
	}
	echo json_encode($rspRes);