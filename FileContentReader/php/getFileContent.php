<?php
	/**
	*检测文件某文件是否存在
	*如果存在读取其内容(处理)并返回之
	*/
	$tmpPath =  "../temp";							//文件上传目录
	$fileName = $_GET['fileName'];	
	$filePath = $tmpPath .'/'. $fileName;		//拼装文件路径
	
	/** 待返回对象 **/
	$rspResult = new stdClass();
	$rspResult->state = 1;				
	$rspResult->errMsg = "系统繁忙，请稍后再尝试"; 

	if( file_exists( $filePath ) && is_file( $filePath ) ){
			$rspResult->state = 0;
			//$rspResult->data = htmlspecialchars( file_get_contents($filePath) );
			$rspResult->data = file_get_contents($filePath);
			unlink( $filePath );		//删除文件
	}

	echo json_encode($rspResult);