<?php
class PriceSheetFactory{
		
	private $excelH;
	private $rate;							//美元-->人民币比率
	private $pubDate;				//报价表发布日期
	private $priceSheets;
	
	public function __construct( ExcelHandler $_excelH, $_rate ){
			$this->excelH = $_excelH;
			$this->rate = $_rate;
			
			$this->pubDate = (string)$this->excelH->getValueByPos(103, 1);		//从约定的行列读取数据
			
			$this->priceSheets = array(	'range' => array(),	'detail' => array() );
	}//func
	
	/***
	  *根据钻石的重量，返回对应的价格矩阵
	  *范围价格从第3行开始，每组5行8列，左边从第2列开始，右边从第15列开始
	  *范围价格从第27行开始，每组10行11列，左边从第2列开始，右边从第15列开始
	  *
	  */
	public function createInstance( $_wt ){

			$iWt = intval( 100*$_wt );
			$type = ( $iWt >= 30 ) ? 'detail' : 'range' ;		//如果小于30分则是range类型，否则是detail类型
					
			//如果是Range类型
			if( 'range' == $type ){
					$prIndex = RangePriceSheet::getIndexByWeight( $iWt );
					if( -1 == $prIndex ){		//如果重量不合法
							return null;
					}

					if( !isset( $this->priceSheets[$type][$prIndex] ) ){
							$isOdd = (bool)( $prIndex & 1);
							$rowNow = floor( $prIndex / 2 );		//从0开始计
							$startRow = 3 + $rowNow * 8;			//在报价表中的开始行
							$startCol  = ( $isOdd ) ?  15 : 2 ;			//在报价表中的开始列
							$rowNum = 5; $colNum = 8;
						
							$this->priceSheets[$type][$prIndex] = new RangePriceSheet( $this->rate,
										$this->excelH->getMatrixByArea( $startRow, $startCol, $rowNum, $colNum ) );
					}
					return  $this->priceSheets[$type][$prIndex]; 
			}//if

			//如果是Detail类型

			$prIndex = DetailPriceSheet::getIndexByWeight( $iWt );
					if( -1 == $prIndex ){		//如果重量不合法
							return null;
			}

			if( !isset( $this->priceSheets[$type][$prIndex] ) ){
					$isOdd = (bool)( $prIndex & 1);
					$rowNow = floor( $prIndex / 2 );		//当前所在'行', 从0开始计
					$startRow = 27 + $rowNow * 13;		//在报价表中的开始行
					$startCol  = ( $isOdd ) ?  15 : 2 ;			//在报价表中的开始列
					$rowNum = 10; $colNum = 11;
						
					$this->priceSheets[$type][$prIndex] = new DetailPriceSheet( $this->rate,
								$this->excelH->getMatrixByArea( $startRow, $startCol, $rowNum, $colNum ) );

					return  $this->priceSheets[$type][$prIndex]; 
			}//if
	}//func

	/**
	 *更新priceSheets中所有priceSheet对象的汇率
	 *
	 *@param float 待更新的汇率
	 *@return true
	 */
	public function updateRate( $_newRate ){
			
			$counter = 0;
			foreach( $this->priceSheets as $typeName => $priceSheetAry ){
					foreach( $priceSheetAry as $priceSheetObj ){
							$priceSheetObj->setRate( $_newRate );
							$counter++;
					}
			}//foreach
				
			return true;
	}//func
	
	public function getPubDate(){
			return $this->pubDate;
	}

}//class