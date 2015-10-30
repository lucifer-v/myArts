package hhm.lucifer.datas;

import java.io.FileInputStream;
import java.io.InputStream;

import jxl.Sheet;
import jxl.Workbook;

public class ReadFromFiles 
{
	private int sheetRows;  //当前读取的sheet的行数,暂不用
	private int sheetCols;  //当前读取的sheet的列数，暂不用
	private String sheetName;  //当前读取的sheet的名字，暂不用
	private InputStream is;  //输入流
	private Workbook wb;  //声明一个工作簿
	
	
	public Workbook getWb() {
		return wb;
	}

	public void setWb(Workbook wb) {
		this.wb = wb;
	}

	public InputStream getIs() {
		return is;
	}

	public void setIs(InputStream is) {
		this.is = is;
	}

	public String getSheetName() {
		return sheetName;
	}

	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}

	public int getSheetRows() {
		return sheetRows;
	}

	public void setSheetRows(int sheetRows) {
		this.sheetRows = sheetRows;
	}

	public int getSheetCols() {
		return sheetCols;
	}

	public void setSheetCols(int sheetCols) {
		this.sheetCols = sheetCols;
	}

	//*****************************以上是数据成员*********************************************

    /**
     * 
     * @param excelFilrPath 将要读取的excel文件的路径
     * @param sheetNum  将要读取的Sheet编号
     * @return
     */
	public Sheet getSheetFromEcxel(String excelFilePath,String sheetNum)
	{
		Sheet sheetBeRead=null;
		try{
			is=new FileInputStream(excelFilePath);
			//取得工作簿
			wb=Workbook.getWorkbook(is);
			//获得工作簿的个数
			wb.getNumberOfSheets();
			//获取所需要的Sheet
			sheetBeRead=wb.getSheet(sheetNum);
			//得到该Sheet的相关信息
			this.setSheetName(sheetBeRead.getName());  //得到Sheet的名字
			this.setSheetRows(sheetBeRead.getRows());  //得到Sheet的行数
			this.setSheetCols(sheetBeRead.getColumns());  //得到Sheet的列数
			//st.getCell(arg0, arg1);  //getCell(cols,row);
			//System.out.println(this.getSheetName()+" \n行："+this.getSheetRows()+" \n列:"+this.getSheetCols());
			return sheetBeRead;
		}
		catch(Exception e)
		{
			return sheetBeRead;
		}
	}// end getSheetFormExcel()
	
	public boolean fillInCurrentPriceForms(Sheet st,CurrentPriceForms[] currentPriceForms)
	{
//		for(int i=1;i<19;i++)
//		System.out.print(currentPriceForms[i].getFormNum()+"\t");
//		System.out.print("here is fillInCurrentPriceForms\n");
//		System.out.println(st.getName()+" \n行："+st.getRows()+" \n列:"+st.getColumns());
		//System.out.println("here fillInCurrentPriceForms()"+st.getCell(1,2).getContents());
		boolean b=true;
		int weightRows=currentPriceForms[0].getWeightRows();  //10
		int weightCols=currentPriceForms[0].getWeightCols();  //11
		int lightRows=currentPriceForms[0].getLightRows();  //5
		int lingtCols=currentPriceForms[0].getLightCols();  //8
		
		try{

			//创建2个10行11列的空2维数组
			   double[][] weightFormObj1=new double[weightRows][weightCols];
			   double[][] weightFormObj2=new double[weightRows][weightCols];
			 //创建2个5行8列的空中介2维数组'
			   double[][] lightFormObj1=new double[lightRows][lingtCols];
			   double[][] lightFormObj2=new double[lightRows][lingtCols];
			   
			   int formCurrentNumber=1;  //记录当前被初始化的表的编号
			   int rowStart=2;
			   int rowEnd=6;
			   int colStart=1;
			   int colEnd=8;
	         //对象数组的初始化工作
			 //前6张表
			   for(int count1=0;count1<3;count1++)
			   {
				 int downAdd=8;  //每循环一次向下+8个单位
				 int leftAdd=13;  
				 for(int row=rowStart;row<=rowEnd;row++)
				 {
					 for(int col=colStart;col<=colEnd;col++)
					 {
						 String valueStr=st.getCell(col, row).getContents();
						// System.out.println("ff:"+st.getCell(col, row).getContents());
						 lightFormObj1[row-rowStart][col-colStart]=Double.parseDouble(valueStr);
						// System.out.println("ff:"+midFormObj1[row-rowStart][col-colStart]);
					 }
					 for(int col=colStart+leftAdd;col<=colEnd+leftAdd;col++)
					 {
						 String valueStr=st.getCell(col, row).getContents();
						 lightFormObj2[row-rowStart][col-colStart-leftAdd]=Double.parseDouble(valueStr);
					 }
					 //某一排的两张表已经初始化完毕
				 }
				 System.out.println("here 1");

				 currentPriceForms[formCurrentNumber].setLight_PriceForm(lightFormObj1);  //初始化light_PriceFrom			
				 currentPriceForms[formCurrentNumber+1].setLight_PriceForm(lightFormObj2);
				 formCurrentNumber+=2;  //下次要初始化的表的编号
				 rowStart+=downAdd;  //下移8行
				 rowEnd+=downAdd;
			   }//end for count
			   
			   //后12张表
			   rowStart=26;
			   rowEnd=35;
			   colStart=1;
			   colEnd=11;
			   for(int count2=0;count2<6;count2++)
			   {
				   int downAdd=13;  //每循环一次向下+13个单位
				   int leftAdd=13;  
				   for(int row=rowStart;row<=rowEnd;row++)
				   {
					   for(int col=colStart;col<=colEnd;col++)
					   {
						   String valueStr=st.getCell(col, row).getContents();
						   weightFormObj1[row-rowStart][col-colStart]=Double.parseDouble(valueStr);
					   }
					   for(int col=colStart+leftAdd;col<=colEnd+leftAdd;col++)
					   {
						   String valueStr=st.getCell(col, row).getContents();
						   weightFormObj2[row-rowStart][col-colStart-leftAdd]=Double.parseDouble(valueStr);
					   }
				   }//end for row
				  
				   currentPriceForms[formCurrentNumber].setWeight_PriceForm(weightFormObj1);
				   currentPriceForms[formCurrentNumber+1].setWeight_PriceForm(weightFormObj2);
				   formCurrentNumber+=2;
				   rowStart+=downAdd;
				   rowEnd+=downAdd;
			   }//end for count
			   
		}
		catch(Exception e)
		{
			e.printStackTrace();
			b=false;
		}
	    return b;
	}
	
    public void close()
    {
    	if(this.getWb()!=null)
    	{
    		try{
    			this.getWb().close();
    		}
    		catch(Exception e)
    		{
    			e.printStackTrace();
    		}
    	}
    }//end close()
}
