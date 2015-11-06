<?php
/**
*文件上传处理脚本
*以下代码仅供演示，如果要整合入项目，请自行编写脚本
*本测试环境下，上传文件的存储目录为 temp/picIn/
*/

//处理上传错误
	if($_FILES['uploadedFile']['error']>0){		//上传错误
		//file_put_contents("../uploadedPicHandler_err.txt", $_FILES['uploadedFile']['error']);
		exit;
	}
	
	//处理上传格式
	//先查看type, 后查看name
	$extAllowed = array("jpg", "jpeg", "png", "gif");
	$mimeAllowed = array("image/jpeg", "image/png", "image/pjepg", "image/png", "image/gif");

	if( !in_array($_FILES['uploadedFile']['type'], $mimeAllowed)){
			if( "application/octet-stream" == $_FILES['uploadedFile']['type'] ){		//如果MIME类型是application/octet-stream
					$infoAry = explode('.', $_FILES['uploadedFile']['name']);
					$fileExt = $infoAry[1];
					if( !in_array($fileExt, $extAllowed)){
							//file_put_contents("../uploadedPicHandler_ext.txt", $fileExt);
							exit;
					}
			}
	}//if
	
	$root = str_replace('\\', '/', dirname( dirname( __FILE__ ) ) );		//项目根目录
	$separator = '_';									//同前端人员交流得到
	$fileInfo=$_POST['fileInfo'];			//fileUploader控件的约定

	$infoAry=explode( $separator , $fileInfo );
	$transactionId=$infoAry[0];			//随机事务id		
	$picName=$infoAry[1];
	$extName=$infoAry[2];

	$fileName=$transactionId."_".$picName.".".$extName;

	$picDir=$root."/temp/picIn";
	$savePath=$picDir."/{$fileName}";

	move_uploaded_file($_FILES['uploadedFile']['tmp_name'], $savePath);