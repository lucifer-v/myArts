<?php
class RangePriceSheet extends PriceSheet{

		public function __construct( $_rate, $_prMatrix ){
				
				parent::__construct( $_rate, $_prMatrix );
				$this->colorSet = array( 'D-F'=>0, 'G-H'=>1, 'I-J'=>2, 'K-L'=>3, 'M-N'=>4 );
				$this->claritySet = array( 'IF-VVS'=>0, 'VS'=>1, 'SI1'=>2, 'SI2'=>3, 'SI3'=>4, 'P1'=>5, 'P2'=>6, 'P3'=>7 );
		}
		
		/**
		*根据钻石的重量来计算其在报价表中的索引(从0开始)
		*
		*@param  float _iWt 重量(单位克拉)
		*@return int 0-5 如果重量合法
		*							-1 如果重量不合法
		*/
		static public function getIndexByWeight( $_iWt ){

				if( 1 <= $_iWt && $_iWt <=3 ){
						return 0;
				}elseif( 4 <= $_iWt && $_iWt <=7  ){
						return 1;
				}elseif( 8 <= $_iWt && $_iWt <=14  ){
						return 2;
				}elseif( 15 <= $_iWt && $_iWt <=17  ){
						return 3;
				}elseif( 18 <= $_iWt && $_iWt <=22  ){
						return 4;
				}elseif( 23 <= $_iWt && $_iWt <=29  ){
						return 5;
				}else{
						return -1;
				}
		}//func
	
}//class