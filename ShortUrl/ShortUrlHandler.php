<?php
/** 
  *此类管理和操作 短网址数据表 
  *
  *@没有处理冲突的情况
  *@create 2015/11/06
  */
class ShortUrlHandler {
		private $dbH;				
		private $shortUrlH;
		private $fullTbName;		//全表名
		private $conf;					//配置参数
	
		/***
		 *实例化ShortUrl对象
		 *
		 *@param MysqlHelper _dbH  数据库交互对象的实例
		 *@param ShortUrl		_shortUrl  短网址类的实例
		 */
		public function __construct( MysqlHelper $_dbH, ShortUrl $_shortUrlH, $_conf){
				$this->dbH = $_dbH;
				$this->shortUrlH = $_shortUrlH;
				$this->conf = $_conf;
				$this->fullTbName = $this->dbH->getPrefix() . $this->conf['su_tbname'];
		}//method

		/***
		 *获得表名全称
		 */
		public function getFullTbName(){

				return	; 
		}//method
		
		/**
		 *根据给定一个长网址生成一个短网址
		 *并将短网址入库
		 *
		 *@param string 长网址
		 *@return mixed 如果成功 返回生成的短网址
		 *								   如果失败，返回false
		 */
		public function buildShortUrl( $_url ){ 
				
				$createtime = time();			//创建时间
				$expires = $createtime + $this->conf['su_expire_interval'];		//截至日期
				$surlId = $this->shortUrlH->shortUrl( $_url ); 				//短网址标识

				$sql = "replace into {$this->fullTbName} (short_url, true_url, expires, lastatime) values ('%s', '%s', '%s', '%s') ";
				$sql = sprintf( $sql, $surlId, $_url, $expires, $createtime);
				
				$newAutoId = $this->dbH->insert( $sql );
				if( $newAutoId > 0 ){
						return $this->conf['su_site_domain'] . "/{$this->conf['su_ctrldir']}/{$surlId}" ;
				}else{
						return false;
				}
		}//method
		
		/**
		 *返回给定短网址指定的长网址
		 *
		 *@param string 短网址
		 *@return mixed 如果找到对应的长网址，返回之
		 *								   如果失败，返回false
		 */
		public function getTrueUrlFromSu( $_surl ){
				
				$sql = "select true_url from {$this->fullTbName} where short_url='{$_surl}'";
				return $this->dbH->getTopLeftVal( $sql );
		}//method

		/**
	      *检测一个短网址是否有效
		  */
		public function isShortUrlValid(){
		
		}//method
		
		/**
		 *清除过期的短网址
		 */
		public function clearExpires(){
				/** TODO **/
		}//method

}//class