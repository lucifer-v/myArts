<?php
header("content-type:text/html; charset=utf-8");
include("../inc/init.php");
include_once( ROOT . "PriceSheet.class.php" );
include_once( ROOT . "RangePriceSheet.class.php" );
include_once( ROOT . "DetailPriceSheet.class.php" );
include_once( ROOT . "PriceSheetFactory.class.php" );

$newRate  = $_POST['newRate'];		//获取要设置的汇率

//读取配置文件，修改汇率
$config = simpleXML_load_file( CONF_PATH );
$rate = floatVal( $config->rate );									//美元-->人民币汇率
$config->rate = $newRate;
$config->asXML(CONF_PATH);			//更新配置文件

$filePath =  ROOT . strval($config->filename );			//pricesheet路径

//创建ExcelHandler对象
include_once( LIB_DIR . "ExcelHandler/PHPExcel/PHPExcel.php");
include_once( LIB_DIR . "ExcelHandler/excelHandler.class.php");
$excelH = new ExcelHandler( $filePath );

//创建PriceSheetFactory对象
include_once( ROOT . "PriceSheetFactory.class.php" );
$psF =  new PriceSheetFactory( $excelH, $rate );

//$instance = $psF->createInstance("0.12");
//$instance = $psF->createInstance("0.19");
//$instance = $psF->createInstance("1.12");
$rspResult = new stdClass();
$rspResult->state = 1;		//错误
$rspResult->errMsg = "系统繁忙，请稍候再尝试";

if( $psF->updateRate( $newRate ) ){
		$rspResult->state = 0;
		$rspResult->sucMsg = '汇率修改成功';
}

echo json_encode( $rspResult );