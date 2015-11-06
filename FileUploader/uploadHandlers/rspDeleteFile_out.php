<?php
	/***
	 *对于uploadedMode模式的控件
	 *删除temp/picOut/目录下的文件
	 */
	$root = str_replace( '\\', '/', dirname( dirname( __FILE__ ) ));
	$fileInfo = $_GET['fileInfo'];			//待删除文件路径

	$separator = '_';
	$infoAry = explode( $separator, $fileInfo );
	$picName = $infoAry[1] . '.' . $infoAry[2];
	
	$picPath = $root . "/temp/picOut/{$picName}";		//uploadedMode下的图片存储路径
	echo unlink($picPath) ? 1 : 0;