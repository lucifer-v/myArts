<?php
	/**
	  *根据前端发送的图片相关信息，将已经存在的图片移动到临时目录
	  *输出目录picOut
	  *只单纯地移动，不做任何其他错误处理，如果需要整合到您自己的项目中去，请自己做好差错处理
	  *
	 */
	$root = str_replace( '\\', '/', dirname( dirname( __FILE__ ) ) );

	$separator = '_';
	$srcFileInfo = $_POST['fileInfo'];											//图片源存储信息, 即前端param选项的prevPicInfo属性
	$srcFileComp = explode( $separator, $srcFileInfo );
	$srcFileDir = $srcFileComp[0];
	$srcFileName = $srcFileComp[1] . '.' . $srcFileComp[2];

	$targetDir="picOut";											//临时存储目录
	
	//复制移动图片到out图片缓存目录
	$tmpDstPath = $root."/temp/{$targetDir}/{$srcFileName}";		//临时存储路径
	$srcPath = $root."/{$srcFileDir}/{$srcFileName}";					//原图片绝对路径
	
	//file_put_contents("D:/log.txt", $tmpDstPath."  ".$srcPath);

	if(is_file($srcPath)){							//保存
				copy($srcPath, $tmpDstPath);
	} 