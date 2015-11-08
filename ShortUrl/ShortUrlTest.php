<?php
/*
http://tp6.cc/index.php/Home/Product/show/_id/66.html
http://tp6.cc/index.php/Home/Product/show/_id/67.html
http://tp6.cc/index.php/Home/Product/index/_pid/24.html
include_once("ShortUrl.class.php");

$su = new ShortUrl();

echo $su->shortUrl("http://lucifer-v.net"), "<br />";
echo $su->shortUrl("http://www.lucifer-v.net"), "<br />";
echo $su->shortUrl("http://lucifer-v.net/mokaFacOrder"), "<br />";
echo $su->shortUrl("http://www.lucifer-v.net/mokaFacOrder"), "<br />";
echo $su->shortUrl("http://tp6.cc/index.php/Home/Product/show/_id/66.html"), "<br />";
echo $su->shortUrl("http://tp6.cc/index.php/Home/Product/show/_id/67.html"), "<br />";
echo $su->shortUrl("http://tp6.cc/index.php/Home/Product/index/_pid/24.html"), "<br />";
echo $su->shortUrl("http://www.baidu.com"), "<br />";
*/

include_once("./Tools/MysqlHelper.class.php");
include_once("./Tools/ShortUrl.class.php");
include_once("./ShortUrlHandler.php");

$conf = include_once("./conf/conf.php");		//配置数据

$mysqlH = new MysqlHelper( $conf['mysql'] );
$suLen = 6;		//设置短网址长度
$su = new ShortUrl( $suLen );			

$shortUrlH = new ShortUrlHandler( $mysqlH, $su, $conf['shortUrl'] );

//测试部分
$url = "http://www.baidu.com";
var_dump( $shortUrlH->buildShortUrl( $url ) );