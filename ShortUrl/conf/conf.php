<?php
	return array(
		/** 短网址配置 **/
		"shortUrl" => array(
				"su_tbname" => "url",							//表名
				"su_length" => 6,									//短网址长度
				"su_ctrldir" => 'su',								//跳转控制目录
				"su_site_domain" => "http://su.cn",	 	//中转站点域名
				"su_expire_interval" => 60,				//短网址过期时间,单位s
				"su_clear_rate" => 0.2							//清理比率，如果上次访问时间与过期时间之差
																					//小于过期时间的20%，那么重新设置过期时间
																					//否则，直接清理之
		),

		/** MySQL服务器配置 **/
		"mysql" => array(
				'host' => '127.0.0.1',
				'port' => 3306,
				'username' => 'root',
				'password' => 'mysql',
				'dbname' => 'db_shorturl',
				'prefix' => 'su_'
		)
	);