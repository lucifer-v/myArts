<?php
/** 此脚本根据重量，返回对应的颜色和净度下拉列表 
  *	rspResult.state = 0 重量合法| 1 重量不合法 | 2 重量合法，但是没有对应重量的钻石价格
  *	rspResult.colorOptions
  *	rspResult.clarityOptions
  *
  */
header("content-type:text/html; charset=utf-8");
include_once( "../inc/init.php" );
include_once( INC_DIR . "tools.php" );				//导入phpTools函数库

$weight = trim( $_POST['weight'] );					//获取重量信息
$currency = $_POST['currency'];							//获取货币信息
$isWtValid = isDecimalValid($weight, 4, 2);	//验证重量是否合法

//准备返回数据
$rspResult = new stdClass();
$rspResult->colorOptions = "<option value='-1'>--NULL--</option>";
$rspResult->clarityOptions = "<option value='-1'>--NULL--</option>";

if( $isWtValid ){		//如果合法
		include_once( ROOT . "PriceSheet.class.php" );
		include_once( ROOT . "RangePriceSheet.class.php" );
		include_once( ROOT . "DetailPriceSheet.class.php" );
		include_once( ROOT . "PriceSheetFactory.class.php" );

		//读取配置文件
		$config = simpleXML_load_file( CONF_PATH );
		$rate = floatVal( $config->rate );									//美元-->人民币汇率
		$config->asXML(CONF_PATH);			//更新配置文件
	
		$filePath =  ROOT . strval($config->filename );			//pricesheet路径

		//创建ExcelHandler对象
		include_once( LIB_DIR . "ExcelHandler/PHPExcel/PHPExcel.php");
		include_once( LIB_DIR . "ExcelHandler/excelHandler.class.php");
		$excelH = new ExcelHandler( $filePath );
		
		//创建PriceSheetFactory对象
		$psF =  new PriceSheetFactory( $excelH, $rate );
	
		//获取PriceSheet对象
		$psObj = $psF->createInstance( $weight );

		if( null == $psObj ){
				$rspResult->state = 2;
				$rspResult->errMsg = "没有对应重量的钻石报价";
		}else{
				
				$rspResult->state = 0;
				$rspResult->colorOptions = $psObj->crtColorOptionsHtml();
				$rspResult->clarityOptions = $psObj->crtClarityOptionsHtml();
				$rspResult->unitPriceUSD = $psObj->getUnitPriceUSD( $psObj->getFirstColor(), $psObj->getFirstClarity() );
		}
}else{
		$rspResult->state = 1;
		$rspResult->errMsg = "重量信息不合法";
}//else

echo json_encode( $rspResult );