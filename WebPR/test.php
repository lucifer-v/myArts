<?php
header("content-type:text/html; charset=utf-8");
include_once("PriceSheet.class.php");
include_once("RangePriceSheet.class.php");
include_once("DetailPriceSheet.class.php");
include_once("PriceSheetFactory.class.php");

include_once("inc/init.php");

//读取配置文件
$config = simpleXML_load_file( CONF_PATH );
$rate = floatVal( $config->rate );									//美元-->人民币汇率
$filePath = ROOT . strval( $config->filename );			//pricesheet路径

//echo RangePriceSheet::getInexByWeight(0.13);

//创建ExcelHandler对象
include_once("lib/ExcelHandler/PHPExcel/PHPExcel.php");
include_once("lib/ExcelHandler/excelHandler.class.php");
$excelH = new ExcelHandler( $filePath );

//创建PriceSheetFactory对象
$psF =  new PriceSheetFactory( $excelH, $rate );
$weight = 1.19;
$psObj = $psF->createInstance( $weight );

//大级价格
//var_dump($psObj->getUnitPriceUSD('M-n', 'SI2'));
//var_dump($psObj->getUnitPriceCNY('M-n', 'SI2'));

//小级价格
//var_dump($psObj->getUnitPriceUSD('E', 'P2'));
//var_dump($psObj->getUnitPriceUSD('L', 'IF'));
//echo "<br />";

$colorOptHtml = $psObj->crtColorOptionsHtml();
$clarityOptHtml = $psObj->crtClarityOptionsHtml();
echo "重量:{$weight}<br />";
echo "颜色:<select>{$colorOptHtml}</select>";
echo "净度:<select>{$clarityOptHtml}</select>";