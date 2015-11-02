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
			unset($rspResult->errMsg);		//删除错误信息
			$rspResult->state = 0;
			
			$fileRows = file( $filePath );

			$tbStr = '<table>';
			foreach( $fileRows as $index => $row){
					$row = preg_replace('/\s*/', '', $row);		//处理空
					if( empty( $row ) ) continue;							//防止出现空格的情况

					$cols = explode(',', $row);
					if( 0 == $index ){
							$tbStr .= "<tr><th>{$cols[0]}</th><th>{$cols[1]}</th>".
											  "<th>{$cols[2]}</th><th>{$cols[3]}</th></tr>";
					}else{
							$tbStr .= "<tr><td>{$cols[0]}</td><td>{$cols[1]}</td>".
											  "<td>{$cols[2]}</td><td>{$cols[3]}</td></tr>";
					}
			}//foreach
			$tbStr .= '</table>';

			$rspResult->data = $tbStr;
			unlink( $filePath );		//删除文件
	}//if

	echo json_encode($rspResult);