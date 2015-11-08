<?php
header("content-type:text/html; charset=utf-8");

include_once("../Tools/MysqlHelper.class.php");
include_once("../Tools/ShortUrl.class.php");
include_once("../ShortUrlHandler.php");

$conf = include_once("../conf/conf.php");		//配置数据

$mysqlH = new MysqlHelper( $conf['mysql'] );
$su = new ShortUrl( $conf['shortUrl']['su_length'] );			

$shortUrlH = new ShortUrlHandler( $mysqlH, $su, $conf['shortUrl'] );

$trueTu = $shortUrlH->getTrueUrlFromSu( $_GET['short_url'] );
if(  NULL !== $trueTu ){		//如果短网址有效
			header("Location:{$trueTu}");
			exit;
}else{		//如果短网址过期或失效
			echo	"无效或过期的短网址";
}