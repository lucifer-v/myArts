<?php
	/**uploadedMode下上传图片( 即删除原来的图片以后，再度上传 )
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
	}
	
	$root = str_replace( '\\', '/', dirname( dirname( __FILE__ ) ) );
	
	$separator = "_";
	$fileInfo = $_POST['fileInfo'];									//
	$infoAry = explode( $separator, $fileInfo );
	$fileName = $infoAry[1] . '.' . $infoAry[2];

	$tmpOutDir = $root."/temp/picOut/{$fileName}";
	move_uploaded_file($_FILES['uploadedFile']['tmp_name'], $tmpOutDir);