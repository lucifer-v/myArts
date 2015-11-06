<?php
	/** 
	 *删除文件
	 *上传文件路径为: temp/temp/picIn
	 *前端发出删除操作以后，也会发送isFileExists请求，如果返回""表示删除成功
	 */
	$root = str_replace('\\', '/', dirname( dirname( __FILE__ ) ));
	
	$separator = '_';
	$fileInfo = $_GET['fileInfo'];			//待删除文件的信息

	$infoAry=explode($separator, $fileInfo);
	$transactionId=$infoAry[0];
	$picName=$infoAry[1];
	$extName=$infoAry[2];

	$fileName=$transactionId."_".$picName.".".$extName;
	$savePath=$root."/temp/picIn/{$fileName}";

	echo unlink($savePath) ? "1" : "0";

	//file_put_contents("D:/fileDelete.txt", $fileName);