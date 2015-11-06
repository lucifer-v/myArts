<?php
	/**
	*在文件存储目录中下检测已上传的文件是否存在
	*检测路径为 temp/picIn/
	*如果检测到，那么返回上传目录的保存路径(相对前端页面的)
	*/
	$root = str_replace('\\', '/', dirname( dirname( __FILE__ ) ));

	$separator = '_';
	$fileInfo=$_GET['fileInfo'];

	$infoAry=explode($separator, $fileInfo);

	$transactionId=$infoAry[0];
	$picName=$infoAry[1];
	$extName=$infoAry[2];

	/*文件系统使用绝对路径，网站中使用站点相对路径*/
	$fileName=$transactionId."_".$picName.".".$extName;
	$picPath="temp/picIn/{$fileName}";
	$savePath=$root.'/'.$picPath;

	if(file_exists($savePath)){		//如果存在则返回路径
		echo $picPath;
	}else{
		echo "";
	}
	//file_put_contents("D:/fileExistCheck.txt", $siteDir);
?>