<?php
abstract class PriceSheet {
		protected $rate;
		protected $priceMatrix;
		protected $colorSet;
		protected $claritySet;
		
		public function __construct( $_rate, $_priceMatrix ){
				$this->rate = $_rate;		
				$this->priceMatrix = $_priceMatrix;
		}

		public function getRate(){
				return $this->rate;
		}

		public function setRate( $_rate ){
				return $this->rate = $_rate;
		}
		
		/** 获取人民币单价 **/
		public function getUnitPriceCNY( $_color, $_clarity ){
				
				return $this->rate * $this->getUnitPriceUSD( $_color, $_clarity );
		}//func

		/** 
		  *获取美元单价
		  *
		  *@param string _color  颜色
		  *@param string _clarity 净度
		  *@return float 美元单价( 表格上是100美元 )
		  */
		public function getUnitPriceUSD( $_color, $_clarity ){

				$colorIndex = $this->colorSet[ strtoupper( $_color ) ];
				$clarityIndex = $this->claritySet[ strtoupper( $_clarity ) ];
				
				return $this->priceMatrix[$colorIndex][$clarityIndex]*100;
		}//func
		
		/** 获得颜色下拉列表选项HTML字符串 **/
		public function crtColorOptionsHtml(){

				$optHtml = '';
				foreach( $this->colorSet as $color => $index ){
						$optHtml .= "<option value='{$color}'>{$color}</option>";
				}	
				return $optHtml;
		}//func

		/** 获得颜色净度下拉列表选项HTML字符串 **/
		public function crtClarityOptionsHtml(){
				
				$optHtml = '';
				foreach( $this->claritySet as $color => $index ){
						$optHtml .= "<option value='{$color}'>{$color}</option>";
				}	
				
				return $optHtml;
		}//func
		
		/** 获取colorSet 属组中的第一个颜色名称 **/
		public function getFirstColor(){
				reset($this->colorSet);
				return key( $this->colorSet );
		}//func

		/** 获取claritySet 属组中的第一个净度名称 **/
		public function getFirstClarity(){
				reset( $this->claritySet );
				return key( $this->claritySet );
		}//func

}//class