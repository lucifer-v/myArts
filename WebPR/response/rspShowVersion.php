<?php
header("content-type:text/html; charset=utf-8");
include_once( "../inc/init.php" );
include_once( ROOT . "PriceSheetFactory.class.php" );

//读取配置文件
$config = simpleXML_load_file( CONF_PATH );
$rate = floatVal( $config->rate );						//美元-->人民币汇率
$filePath = ROOT . strval( $config->filename );			//pricesheet路径

//创建ExcelHandler对象
include_once( LIB_DIR . "ExcelHandler/PHPExcel/PHPExcel.php");
include_once( LIB_DIR . "ExcelHandler/excelHandler.class.php");
$excelH = new ExcelHandler( $filePath );

//创建PriceSheetFactory对象
$psF =  new PriceSheetFactory( $excelH, $rate );

//响应数据
echo $psF->getPubDate();