<?php
	/***
	  *此脚本将已经上传的文件移动到指定目录
	  *演示中使用temp目录
	  *默认的文件上传表单控件名字是fdrFile
	  *真实业务中请自己书写此脚本
	  */
	  header("content-type:text/html; charset=utf-8");
		
	/** 文件上传大小检测
	  *	$_POST['MAX_FILE_SIZE']
	  **/		

	/**
	  *文件类型检测
	  *  $_POST['allowedExt']
	  **/
	
	 //系统上传错误
	  if($_FILES['fdrFile']['error'] > 0){
			//错误
			echo "系统错误";
			file_put_contents("../errlog.txt", "上传文件出错\r\n", FILE_APPEND);
			exit;
	  }
	  
	  //移动文件
	  $extName = strrchr( $_FILES['fdrFile']['name'], '.');
	  $tmpName =$_POST['fileId'] . $extName;		//合成文件名
	  move_uploaded_file($_FILES['fdrFile']['tmp_name'], "../temp/{$tmpName}");
?>