package hhm.lucifer.datas;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.text.NumberFormat;
import java.util.Locale;

import hhm.lucifer.activity.DiamoPriceActivity;
import jxl.Sheet;

public class Tools 
{   
	/***
	 * 获得DiamoPriceActivity对象
	 * @param dpa
	 */
	public static boolean initial(DiamoPriceActivity dpa)
	{
		boolean b=false;
		//new每一个CurrentPriceForms对象,并为之设定编号
		for(int i=0;i<dpa.getCurrentPriceForms().length;i++)
		{
			dpa.getCurrentPriceForms()[i]=new CurrentPriceForms();
			dpa.getCurrentPriceForms()[i].setFormNum(i);
		}
		//创建ReadFromFiles对象
		ReadFromFiles rff=new ReadFromFiles();
		//用xls文件的路径和Sheet的编号得到Sheet
        Sheet st=rff.getSheetFromEcxel(dpa.getParas()[0],dpa.getParas()[1]);
		//将18张表存入CurrentPriceForms对象数组
		if(rff.fillInCurrentPriceForms(st, dpa.getCurrentPriceForms()))
			b=true;
		rff.close();  //关闭数据流
		return b;
	}
	
	
	/***
	 * 从配置文件中获取3个参数
	 * @return
	 */
	public static String[] getIniParameters(String[] paras)
	{
		String[] parameters=new String[3];
		String temp;
	    File file;
	    BufferedReader source;
	    try{
	      file=new File("/mnt/sdcard/diamondCfg/config.txt");
	    	   source=new BufferedReader(new FileReader(file));
	    	   while((temp=source.readLine())!=null)
	    	   {
	    		   //如果有空行，或者是以#号开头，则忽略
	    		  if(temp.equals("")||temp.subSequence(0, 1).equals("#"))
	    			  continue;
	    		  //System.out.println(temp.trim());  //去掉前后的空格
	    		  String[] multiStr=temp.split("=");  //将参数行由“=”号分开
	    		  String[] parameterStr=multiStr[1].split("\"");  //取得双引号中真正的参数
	    		  
	    	      if(multiStr[0].equals("filePath"))
	    	    	  parameters[0]=parameterStr[1];
	    	      else if(multiStr[0].equals("sheetNum"))
	    	    	  parameters[1]=parameterStr[1];
	    	      else if(multiStr[0].equals("exchangeRate"))
	    	    	  parameters[2]=parameterStr[1];	
	    	      
	    	      for(int i=0;i<parameters.length;i++)
	    	    	  paras[i]=parameters[i];
	    	   }
	       }
	       catch(Exception e)
	       {
	    	   e.printStackTrace();
	       }
		return parameters;
	}
	
	/***
	 * 修改汇率
	 * @param exchangeRate 新汇率
	 * @return 修改成功则返回true
	 */
	public static boolean changeExchangeRate(String exchangeRate)
	{
		boolean b=false;
		
		String cfgFilePath="/mnt/sdcard/diamondCfg/config.txt";  //配置文件
		String tempFilePath="/mnt/sdcard/diamondCfg/temp.txt";  //临时文件
		String temp="";
		File file=new File(cfgFilePath);
		File tempFile=new File(tempFilePath);
		BufferedReader source;
		BufferedWriter target;
		try{
			 source=new BufferedReader(new FileReader(file));
			 target=new BufferedWriter(new FileWriter(tempFile));
			 
			 while((temp=source.readLine())!=null)
			 {
				//如果有空行，或者是以#号开头，则忽略
	    		  if(temp.equals("")||temp.subSequence(0, 1).equals("#"))
	    		  {
				      target.write(temp);   //复制文件
				      target.newLine();
				      target.flush();
	    			  continue;
	    		  }
	    		  //System.out.println(temp.trim());  //去掉前后的空格
	    		  String[] multiStr=temp.split("=");  //将参数行由“=”号分开
	    	
	    	    if(multiStr[0].equals("exchangeRate"))
	    		   temp="exchangeRate="+"\""+exchangeRate+"\"";	    	

	    	      target.write(temp);  //复制文件
			      target.newLine();
			      target.flush();
			 }
			 //如果不关闭这两个流，则无法删除原来的config.txt
			 source.close();
			 target.close();
			 //删去原来的config.txt,将tempFile改名为cofig.txt
			 file.delete();
			 tempFile.renameTo(new File("/mnt/sdcard/diamondCfg/config.txt"));
			 b=true;
		}catch(Exception e){
		  e.printStackTrace();
		}
		return b;
	}
	
	/***
	 * 
	 * @param money
	 * @param country
	 * @return 相应国家钱的显示
	 */
	public static String getCurrencyFormat(double money,String country)
	{
		 String theRightFormat="";
		 NumberFormat chinaFormat=NumberFormat.getCurrencyInstance(Locale.CHINA);
		 NumberFormat amerivanFormat=NumberFormat.getCurrencyInstance(Locale.US);
		 if(country.equals("china"))
			 theRightFormat=chinaFormat.format(money);
		 else
			 theRightFormat=amerivanFormat.format(money);
		 return theRightFormat;
	}
	
	/**
	 * @category 看String是否能转换为double
	 * @return 能则返回true 否则返回false
	 * */
	public static boolean rateIsDouble(String rateBeSet) {
		boolean b = false;
		try {
			double newRate = Double.parseDouble(rateBeSet);
			b = true;
			return b;
		} catch (NumberFormatException e) {
			return b;
		}
	}
	
	/***
	 * 检查输入的weight是否合法
	 * @param weight
	 * @return 合法则true
	 */
	public static boolean checkWeight(String weight)
	{  
		//1）先看能不能double话，否则不合法
		//2）长度为4，则只能在0.01--5.99之间
		//3）长度为5，则只能在10.00--10.99之间
		boolean b=false;
		b=Tools.rateIsDouble(weight);  //借用上面的函数
		if(b)
		{
			b=false;
			//如果可以double化,进一步限制
			double value=Double.parseDouble(weight);
			if((0.01<=value&&value<=5.99)||(10.00<=value&&value<=10.99))
				b=true;
		}//end if
		return b;
	}//end function
	
	/***
	 * 根据宝石重量来给出价格表的编号
	 * @param weight
	 * @return
	 */
	public static int getFormNumByWeight(double weight)
	{
		int formNum=0;   //若为0；则输入有错误
		   
		   if(0.01<=weight&&weight<=0.03)
			   formNum=1;
		   else if(0.04<=weight&&weight<=0.07)
			   formNum=2;
		   else if(0.04<=weight&&weight<=0.07)
			   formNum=2;
		   else if(0.08<=weight&&weight<=0.14)
			   formNum=3;
		   else if(0.15<=weight&&weight<=0.17)
			   formNum=4;
		   else if(0.18<=weight&&weight<=0.22)
			   formNum=5;
		   else if(0.23<=weight&&weight<=0.29)
			   formNum=6;
		   else if(0.30<=weight&&weight<=0.39)
			   formNum=7;
		   else if(0.40<=weight&&weight<=0.49)
			   formNum=8;
		   else if(0.50<=weight&&weight<=0.69)
			   formNum=9;
		   else if(0.70<=weight&&weight<=0.89)
			   formNum=10;
		   else if(0.90<=weight&&weight<=0.99)
			   formNum=11;
		   else if(1.00<=weight&&weight<=1.49)
			   formNum=12;
		   else if(1.50<=weight&&weight<=1.99)
			   formNum=13;
		   else if(2.00<=weight&&weight<=2.99)
			   formNum=14;
		   else if(3.00<=weight&&weight<=3.99)
			   formNum=15;
		   else if(4.00<=weight&&weight<=4.99)
			   formNum=16;
		   else if(5.00<=weight&&weight<=5.99)
			   formNum=17;
		   else if(10.00<=weight&&weight<=10.99)
			   formNum=18;
		   else ;
		 
		   return formNum;
	}
	
	/**
	 * @category 判读路径所显示的文件格式是否是.xls
	 * */
	public static boolean isFileFormateRight(String filePath) {
		boolean b = false;
		String thePath = filePath; //获取txtExcelPath上的Excel文件路径
		int thePathLength = thePath.length(); //得到文件长度
		String theExtension = thePath.substring(thePathLength - 3,thePathLength); //得到扩展名
		if (theExtension.equals("xls")) {
			b = true;
			//this.showWarningDialog("扩展名是:" + theExtension);
		}
		return b;
	}
	
	public static boolean checkSheetName(String sheetName)
	{
		boolean b=true;
		//如果sheetName的前5个字母不是Sheet，余下的不是整数，则错误
        int length=sheetName.length();
        String fisrtFive=sheetName.substring(0, 5);
        String theRest=sheetName.substring(5, length);
        try{
        	if(!fisrtFive.equals("Sheet"))
        		b=false;
        	int toInt=Integer.valueOf(theRest);  //不需要用，只用来捕捉莫须有的错误
        	return b;
        }
        catch(Exception e)
        {
        	b=false;
        	return b;
        }
	}
}//end class Tools
