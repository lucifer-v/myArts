package hhm.lucifer.datas;

public class CurrentPriceForms 
{
	private int formNum;  //当前要使用表编号
	   
	   private int lightRows=5;  //前六张表的行数
	   private int lightCols=8;  //前六张表的列数
	 //double型二维数组，前六张的,5行8列
	   private double[][] light_PriceForm=new double[lightRows][lightCols];
	   
	   private int weightRows=10;  //后十二张表的行数
	   private int weightCols=11;  //后十二张表的列数
	 //double型二维数组,后十二张的，10行11列
	   private double[][] weight_PriceForm=new double[weightRows][weightCols];
	    
	   public int getFormNum() {
		return formNum;
	}
	public void setFormNum(int formNum) {
		this.formNum = formNum;
	}
	public int getLightRows() {
		return lightRows;
	}
	public void setLightRows(int lightRows) {
		this.lightRows = lightRows;
	}
	public int getLightCols() {
		return lightCols;
	}
	public void setLightCols(int lightCols) {
		this.lightCols = lightCols;
	}
	public double[][] getLight_PriceForm() {
		return light_PriceForm;
	}
	public void setLight_PriceForm(double[][] lightPriceForm) {
		for(int row=0;row<lightRows;row++)
		   {
			   for(int col=0;col<lightCols;col++)
			   {
	          this.light_PriceForm[row][col]=lightPriceForm[row][col];
	          //System.out.println("here setMid_PriceForm:"+mid_PriceForm[row][col]);
			   }
		   }
	}
	public int getWeightRows() {
		return weightRows;
	}
	public void setWeightRows(int weightRows) {
		this.weightRows = weightRows;
	}
	public int getWeightCols() {
		return weightCols;
	}
	public void setWeightCols(int weightCols) {
		this.weightCols = weightCols;
	}
	public double[][] getWeight_PriceForm() {
		return weight_PriceForm;
	}
	public void setWeight_PriceForm(double[][] weightPriceForm) {
		for(int row=0;row<weightRows;row++)
		   {
			   for(int col=0;col<weightCols;col++)
	          this.weight_PriceForm[row][col]=weightPriceForm[row][col];
		   }
	}

	//************************以上是数据成员******************************************   
	/***
	 * 设置每张表的编号
	 * @param num
	 */
	public void setPriceFormNum(int num)
	{
		this.setFormNum(num);
	}

	/***
	 * 根据表的编号显示每张表
	 * @param num
	 */
	public String showFormByNum()
	{
		int num=formNum;
		String form="";
		if(num>=1&&num<=18)//如果是第1--18张表
		{
			//如果是前6张表
			if(num<=6)
			{
				for(int i=0;i<lightRows;i++)
				{
					for(int j=0;j<lightCols;j++)
                       form+=light_PriceForm[i][j]+" ";
					form+="\n";
				}
			}
			//如果是后12张表
			if(num>6)
			{
				for(int i=0;i<weightRows;i++)
				{
					for(int j=0;j<weightCols;j++)
                       form+=weight_PriceForm[i][j]+" ";
					form+="\n";
				}
			}
		}//end if
		return form;
	}//end showForm
	
}//end  class CurrentPriceForms
