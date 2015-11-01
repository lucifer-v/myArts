<?php
header("content-type:text/html; charset=utf-8");

//读取配置文件
$config = simpleXML_load_file("../conf.xml");
$rate = floatVal( $config->rate );						//美元-->人民币汇率

echo $rate;