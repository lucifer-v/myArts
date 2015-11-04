<?php
	/*
	  *此文件 请求创建一个新的备注(任务)
	  *如果"选中的日期" 不是当前日期要做出处理
	*/
	include("../inc/init.php");
	include( MODEL_PATH . "memoTask.eclass.php" );
	include( MODEL_PATH . "memoTaskassign.eclass.php" );

	$tb_task = "tb_memo_task";
	$tb_taskassign = "tb_memo_taskassign";

	$selectedDateStr = $_GET['selectedDateStr'];				//选中的日期
	$creator = $_GET['creator'];				//创建者
	$subject = $_GET['subject'];					//内容
	$comments = $_GET['comments'];	//备注

	$dbTool = new MysqlDBTool($host, $uname, $pwd, $dbname);
	$newSeqNo = MemoTask::buildNewSeqNo($dbTool, $tb_task);		//消息序列号
	$newTaskNo = MemoTask::buildNewTaskNo($newSeqNo);		//消息编号
	$isSent = 0;						//发送否
	$isDone = 0;					//完成否
	$othReciver = "";			//其他接收者
	$reciverRead = 0;			//接收者阅读否

	//创建事件处理
	$curTime = time();
	$curDateStr = date("Y-m-d", $curTime);

	$createDate = strtotime($selectedDateStr." 00:00:00");
	if($curDateStr == $selectedDateStr){		//如果是当日，记录准确时间
			$createDate = $curTime;
	}

	$mt = new MemoTask($dbTool, $tb_task, $newTaskNo, $newSeqNo, $creator, $createDate, $isSent, $isDone,
			$othReciver, $reciverRead, $subject, $comments);
	$mta = new MemoTaskAssign($dbTool, $tb_taskassign, $newTaskNo, $creator);
	
	$bRetVal = $mt->createTask($mta);		//创建对象
	
	/*响应对象*/
	$rspRes = array("isSuc" => 0 );
	if($bRetVal){					//如果创建失败
			$rspRes['isSuc'] = 1;
	}
	echo json_encode($rspRes);
	//var_dump($taskSet);