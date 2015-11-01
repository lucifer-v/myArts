<?php
class DetailPriceSheet extends PriceSheet{

		public function __construct( $_rate, $_prMatrix ){
				
				parent::__construct( $_rate, $_prMatrix );
				$this->colorSet = array( 'D'=>0, 'E'=>1, 'F'=>2, 'G'=>3, 'H'=>4,'I'=>5, 'J'=>6, 'K'=>7, 'L'=>8, 'M'=>9 );
				$this->claritySet = array( 'IF'=>0, 'VVS1'=>1, 'VVS2'=>2, 'VS1'=>3, 'VS2'=>4, 'SI1'=>5, 'SI2'=>6, 'SI3'=>7,
						'P1'=>8, 'P2'=>9, 'P3'=>11 );
		}

		/**
		*根据钻石的重量来计算其在报价表中的索引(从0开始)
		*
		*@param  float _iWt 重量(单位克拉)
		*@return int 0-11 如果重量合法
		*							-1 如果重量不合法
		*/
		static public function getIndexByWeight( $_iWt ){

				if( 30 <= $_iWt && $_iWt <=39 ){
						return 0;
				}elseif( 40 <= $_iWt && $_iWt <= 49  ){
						return 1;
				}elseif( 50 <= $_iWt && $_iWt <= 69  ){
						return 2;
				}elseif( 70 <= $_iWt && $_iWt <= 89  ){
						return 3;
				}elseif( 90 <= $_iWt && $_iWt <= 99  ){
						return 4;
				}elseif( 100 <= $_iWt && $_iWt <= 149  ){
						return 5;
				}elseif( 150 <= $_iWt && $_iWt <= 199 ){
						return 6;
				}elseif( 200 <= $_iWt && $_iWt <= 299 ){
						return 7;
				}elseif( 300 <= $_iWt && $_iWt <= 399 ){
						return 8;
				}elseif( 400 <= $_iWt && $_iWt <= 499 ){
						return 9;
				}elseif( 500 <= $_iWt && $_iWt <=599 ){
						return 10;
				}elseif( 1000 <= $_iWt && $_iWt <= 1099 ){
						return 11;
				}else{
						return -1;
				}
		}//func
	
}//class