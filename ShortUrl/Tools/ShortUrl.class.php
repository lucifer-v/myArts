<?php
/**
  *短网址解决方案
  *
  *过期策略：当执行清除的时候，不能只看绝对的过期时间，如果最后访问时间与
  *						  过期时间相差小于 过期预设时间的20%，那么继续保留之
  *
  *@create 2015/09/28
  *@lastmodify_date 2015/11/06
  */
class ShortUrl {
		private $radixDict;		//进制字典
		private $len;					//长度
		
		/** 初始化对象，设置进制字典 **/
		public function __construct( $_len = 6, $_dict = null ){

				$this->len = $_len;
				$this->radixDict = $_dict ?  :		
						'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' ;
		}//func
		
		/**
		  *将一个长网址转换为短网址标识
		  *
		  *@param string _url 待转换的长网址
		  *@param boolean $_zeroPad 是否填充前导零 true为是, false为否
		  *@return string 6位短网址标识
		  */
		public function shortUrl( $_url, $_zeroPad = true ){

				return $this->decTo62( sprintf( "%u", crc32($_url) ), $_zeroPad );
		}//func
		
		/**
		  *将一个十进制按当前基数字典转化为62进制数
		  *
		  *@param int $_dec 十进制数
		  *@param boolean $_zeroPad 是否填充前导零 true为是, false为否
		  *		'0'是当前基数字典中的第一个,而非传统的数值0
		  *@return string 一个62进制数
		  */
		public  function decTo62( $_dec, $_zeroPad = false ){
				
				$num62 = "";
				do{		//执行转换
						$num62 = $this->radixDict[$_dec % 62] . $num62;
				}while( $_dec = intVal($_dec /  62) );

				return ($_zeroPad) ? str_pad($num62, $this->len, $this->radixDict[0], STR_PAD_LEFT) 
							  : $num62;
		}//func
		
}//class