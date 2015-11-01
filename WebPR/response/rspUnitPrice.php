<?php
/*根据钻石的重量、颜色、净度、币种信息返回裸石单价
  *如果重量输入错误，根本不会出现，调用这一步的情况
  *因此，此脚本不需要验证weight的合理性
  */
include_once( "../inc/init.php" );
include_once( ROOT . "PriceSheet.class.php" );
include_once( ROOT . "RangePriceSheet.class.php" );
include_once( ROOT . "DetailPriceSheet.class.php" );
include_once( ROOT . "PriceSheetFactory.class.php" );

//获取用户数据
$weight = $_POST['weight'];
$color = $_POST['color'];
$clarity = $_POST['clarity'];
$currency = $_POST['currency'];

//读取配置文件
$config = simpleXML_load_file( CONF_PATH );
$rate = floatVal( $config->rate );			//美元-->人民币汇率
$config->asXML(CONF_PATH);				//更新配置文件
	
$filePath =  ROOT . strval($config->filename );			//pricesheet路径

//创建ExcelHandler对象
include_once( LIB_DIR . "ExcelHandler/PHPExcel/PHPExcel.php");
include_once( LIB_DIR . "ExcelHandler/excelHandler.class.php");
$excelH = new ExcelHandler( $filePath );

//创建PriceSheetFactory对象
include_once( ROOT . "PriceSheetFactory.class.php" );
$psF =  new PriceSheetFactory( $excelH, $rate );
	
//获取PriceSheet对象
$psObj = $psF->createInstance( $weight );

//返回信息
$rspResult  = new stdClass();
$rspResult->state = 0;
$rspResult->unitPriceUSD = round( $psObj->getUnitPriceUSD( $color, $clarity ) );

echo json_encode( $rspResult );