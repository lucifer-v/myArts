<?php
	/*用于已上传模式下,检测是否存在图片
	 *查询的目标目录是picOut
	*/
	$root=str_replace( '\\', '/', dirname( dirname( __FILE__ ) ) );
	
	$separator = '_';
	$fileInfo = trim( $_GET["fileInfo"] );

	$fileInfoComp = explode($separator, $fileInfo);
	$saveDir = $fileInfoComp[0];
	$picName = $fileInfoComp[1];
	$extName = $fileInfoComp[2];

	$fileName = $picName . "." . $extName;
	$urlPath = "temp/picOut/{$fileName}";		//临时缓存路径
	$filePath = $root . '/'. $urlPath;				 //临时缓存路径绝对路径

	if(is_file($filePath)){		//已经复制到临时缓存路径
			echo $urlPath;
	}else{
			echo "";
	}