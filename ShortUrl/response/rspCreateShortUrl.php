<?php
/** 暂时不做差错检测 **/

//获取真实地址
$trueUrl = $_POST['trueUrl'];

/* TODO: 如果地址不合法，直接返回false */

include_once("../Tools/MysqlHelper.class.php");
include_once("../Tools/ShortUrl.class.php");
include_once("../ShortUrlHandler.php");

$conf = include_once("../conf/conf.php");		//配置数据

$mysqlH = new MysqlHelper( $conf['mysql'] );
$suLen = 6;		//设置短网址长度
$su = new ShortUrl( $suLen );			

$tbName = "url";
$shortUrlH = new ShortUrlHandler( $mysqlH, $su, $conf['shortUrl'] );

if( $surl = $shortUrlH->buildShortUrl( $trueUrl ) ){		//如果生成成功
		echo $surl;		
}else{
		echo '';
}