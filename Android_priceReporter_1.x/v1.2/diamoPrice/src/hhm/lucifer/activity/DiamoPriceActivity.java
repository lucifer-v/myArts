package hhm.lucifer.activity;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Exchanger;

import hhm.lucifer.datas.CurrentPriceForms;
import hhm.lucifer.datas.Tools;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.RadioGroup.OnCheckedChangeListener;
import android.widget.SimpleAdapter.ViewBinder;

public class DiamoPriceActivity extends Activity {

	private CurrentPriceForms[] currentPriceForms = new CurrentPriceForms[19]; //将要存放数据的18张表,舍弃第一个不用
	private int formNum=0; //根据输入的价格选定表格的编号
	private int colorIndex; //comboColor中选定的值所对应的下标
	private int netIndex; //comboNet中选定的值所对应的下标
	private Spinner spinnerColor; //颜色下拉列表
	private Spinner spinnerNet;  //净度下拉列表
	private EditText txtWeight;  //输入重量的EditText
	private EditText txtUnitPrice; //显示单价的EditText
	private EditText txtDiscount;  //显示折扣的EditText
	private EditText txtTotalPrice; //显示总价的EditText
	private RadioGroup radioGroup; //单选按钮组
	private RadioButton rdbUS;  //按美元显示的单选按钮
	private RadioButton rdbRMB;  //按人民币显示的单选按钮
	
	private double weightEnter; //输入的钻石重量
	private double discountEnter; //输入的折扣
	private double unitPriceEnter;  //输入的单价
	private double totalPriceEnter;  //输入的总价
	private double US_unitPrice; //美元单价
	private double US_totalPrice;  //美元总价
	private double RMB_unitPrice; //人民币单价
	private double RMB_totalPrice; //人民币总价
	private int discount; //折扣
	
	private DecimalFormat df=new DecimalFormat("###");  //格式化显示的对象
	
	private String[] paras = new String[3]; //初始化需要的三个参数filePath sheetNum exchageRate
	
	public String[] getParas() {
		return paras;
	}

	public CurrentPriceForms[] getCurrentPriceForms() {
		return currentPriceForms;
	}
	
	//***************************以上述数据成员
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
         
        //********************获取三个参数
        Tools.getIniParameters(paras);
        //生成并初始化18张表,利用Tools的initial()
        if(Tools.initial(this))
        	Toast.makeText(getApplicationContext(), "初始化成功", Toast.LENGTH_LONG).show();
        else
        	Toast.makeText(getApplicationContext(), "初始化失败", Toast.LENGTH_LONG).show();
        
        txtUnitPrice=(EditText)this.findViewById(R.id.txtUnitPrice); //得到txtUnitPrice控件
        txtUnitPrice.addTextChangedListener(new TxtUnitPriceListener()); //添加监听事件
        txtUnitPrice.setOnFocusChangeListener(new TxtFocusChangeLinster()); //监听焦点改变
        
        txtDiscount=(EditText)this.findViewById(R.id.txtDiscount);
        txtDiscount.addTextChangedListener(new TxtDiscountListener());  //添加事件
        txtDiscount.setOnFocusChangeListener(new TxtFocusChangeLinster());
        
        txtTotalPrice=(EditText)this.findViewById(R.id.txtTotalPrice);
        txtTotalPrice.addTextChangedListener(new TxtTotalPriceListener()); //添加事件
        txtTotalPrice.setOnFocusChangeListener(new TxtFocusChangeLinster());
        
        setTxtDisable();
        
        //*******************单选按钮组
        radioGroup=(RadioGroup)this.findViewById(R.id.radiogroup1);
        radioGroup.setOnCheckedChangeListener(new RdbChangedListener());
        //******************按人民币显示的单选按钮
        rdbRMB=(RadioButton)this.findViewById(R.id.rdbRMB);
        //******************按美元显示的单选按钮
        rdbUS=(RadioButton)this.findViewById(R.id.rdbUS);
        //********************汇率按钮
        Button btnExchange=(Button)this.findViewById(R.id.btnExchange);
        btnExchange.setOnClickListener(new BtnExchangeListener());
        //********************设置按钮
        Button btnSet=(Button)this.findViewById(R.id.btnSet);
        btnSet.setOnClickListener(new BtnSetListener());
        //********************刷新按钮
        Button btnExit=(Button)this.findViewById(R.id.btnRefresh);
        btnExit.setOnClickListener(new BtnRefresListener());
        
        //监听txtWeight
        txtWeight=(EditText)this.findViewById(R.id.txtWeight);
        txtWeight.addTextChangedListener(new TxtWeightChangeListener());
        
        spinnerColor=(Spinner)this.findViewById(R.id.spinnerColor);
        spinnerNet=(Spinner)this.findViewById(R.id.spinnerNet);
        unloadSpinner(); //初始化两个Spinner

        //为下拉列表设置各种事件的响应,这个是响应下拉菜单被选中
        spinnerColor.setOnItemSelectedListener(new SpinnerColorListener());
        spinnerNet.setOnItemSelectedListener(new SpinnerNetListener());

    }//end onCreate()
    
   
    private void setTxtDisable()
    {
    	txtUnitPrice.setEnabled(false);
    	txtDiscount.setEnabled(false);
    	txtTotalPrice.setEnabled(false);
    }
    
    private void setTxtEnable()
    {
    	txtUnitPrice.setEnabled(true);
    	txtDiscount.setEnabled(true);
    	txtTotalPrice.setEnabled(true);
    }
    
    /***
     * ，如果单选按钮选择正确，计算价格,按刷新按钮，也用这个函数计算
     */
    public void calculation() {
    	
    	setTxtEnable(); //开启下面三个editText
    	discount=100;  //每次初始化折扣为100
		int nub =formNum; //得到表的编号
		//得到所选的颜色和净度下标
		int _colorIndex = colorIndex;
		int _netIndex = netIndex;
		//得到汇率
		double exchangeRate = Double.parseDouble(paras[2]);

		if (_netIndex >=0 && _colorIndex >= 0) {
			if (nub <= 6)
				US_unitPrice = this.getCurrentPriceForms()[nub].getLight_PriceForm()[_colorIndex][_netIndex]*100;
			else
				US_unitPrice = this.getCurrentPriceForms()[nub].getWeight_PriceForm()[_colorIndex][_netIndex]*100;
		}

		//显示
		RMB_unitPrice = exchangeRate * US_unitPrice;
		RMB_totalPrice=RMB_unitPrice*weightEnter;
		US_totalPrice=US_unitPrice*weightEnter;
		
		if(rdbUS.isChecked())  //按美元显示
		{
			unitPriceEnter=US_unitPrice;
			totalPriceEnter=US_totalPrice;
			showPrice(df.format(US_unitPrice),df.format(discount),df.format(US_totalPrice));
		}else  //按人民币显示
		{
			unitPriceEnter=RMB_unitPrice;
			totalPriceEnter=RMB_totalPrice;
			showPrice(df.format(RMB_unitPrice),df.format(discount),df.format(RMB_totalPrice));
		}
//		txtRMB.setText(Tools.getCurrencyFormat(rmbPrice, "china"));
//		txtUS.setText(Tools.getCurrencyFormat(dollarPrice,"america"));
	}
    

    /****
     * 显示单价，总价和折扣
     * @param unitPrice 单价
     * @param discount 折扣
     * @param totalPrice  总价
     */
    public void showPrice(String unitPrice,String discount,String totalPrice)
    {
    	txtUnitPrice.setText(unitPrice);
		txtDiscount.setText(discount);
		txtTotalPrice.setText(totalPrice);
    }
    
    
    /***
     * 当找不到对表或者最开始加载的时候，下拉列表的显示
     */
    public void unloadSpinner()
    {
    	List<String> list=new ArrayList<String>();
    	list.add("---NULL---");
    	ArrayAdapter<String> adapter=new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item,list);
    	adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
    	spinnerColor.setAdapter(adapter);
    	spinnerNet.setAdapter(adapter);
    	
//    	txtRMB.setText("￥0.00");
//		txtUS.setText("＄0.00");
    }
    
    /***
     * 按钻石所决定的编号加载两个下拉列表
     */
	public void loadSpinner() {
		
		//颜色
		String lightColor[] = { "D-F", "G-H", "I-J", "K-L", "M-N" };
		String weightColor[] = { "D", "E", "F", "G", "H", "I", "J", "K", "L",
				"M" };
		//净度
		String lightNet[] = { "IF-VVS", "VS", "SI1", "SI2", "SI3", "P1", "P2",
				"P3" };
		String weightNet[] = { "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1",
				"SI2", "SI3", "P1", "P2", "P3" };
		
	   List<String> colorList=new ArrayList<String>();
	   List<String> netList=new ArrayList<String>();
       
	   if(formNum<=6)  //如果是前6张表
	   {
		   for(int i1=0;i1<lightColor.length;i1++)
			   colorList.add(lightColor[i1]);
		   for(int j1=0;j1<lightNet.length;j1++)
			   netList.add(lightNet[j1]);
	   }
	   else
	   {
		   for(int i1=0;i1<weightColor.length;i1++)
			   colorList.add(weightColor[i1]);
		   for(int j1=0;j1<weightNet.length;j1++)
			   netList.add(weightNet[j1]);
	   }
	   //创建两个适配器
	   ArrayAdapter<String> colorAdapter,netAdapter;
	   colorAdapter=new ArrayAdapter<String>(this, android.R.layout.simple_dropdown_item_1line,colorList);
	   netAdapter=new ArrayAdapter<String>(this, android.R.layout.simple_dropdown_item_1line,netList);
	   //下拉列表样式
	   colorAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
	   netAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
	   //将适配器添加到下拉列表
	   spinnerColor.setAdapter(colorAdapter);
	   spinnerNet.setAdapter(netAdapter);
	}
    
    //************************以下是内部类
	
	//*****************监听焦点是否改变的类
	private class TxtFocusChangeLinster implements View.OnFocusChangeListener
	{
		public void onFocusChange(View v, boolean hasFocus) {
			EditText tmp=(EditText)v;
        	tmp.selectAll();
		}
	}
	
    //**********************汇率按钮的监听类
    private class BtnExchangeListener implements View.OnClickListener
    {
		public void onClick(View v)
		{
			String exchange="当前汇率："+paras[2];
//			exchange+="\n当前表单："+paras[1];
//			exchange+="\nxls路径："+paras[0];
			Toast.makeText(getApplicationContext(), exchange, Toast.LENGTH_LONG).show();
		}
    }//end class BtnExchangeListener
	
    //************************设置按钮的监听类
    private class BtnSetListener implements View.OnClickListener
    {
		public void onClick(View v)
		{
			//Toast.makeText(getApplicationContext(), "设置按钮", Toast.LENGTH_LONG).show();
			Intent intent=new Intent();
			intent.setClass(DiamoPriceActivity.this, SettingActivity.class);
			//跳转汇率设置页面
			startActivity(intent);
			finish();
		}
    	
    }//end class BtnSetListener
    
    //************************刷新按钮的监听类
    private class BtnRefresListener implements View.OnClickListener
    {
		public void onClick(View v)
		{
			//Toast.makeText(getApplicationContext(), "退出按钮", Toast.LENGTH_LONG).show();
		    if(formNum!=0) //输入值有效的情况下才允许刷新
			    calculation();
		}
    }//end class BtnExitListener
   
    //************************txtWeight监听类
    private class TxtWeightChangeListener implements TextWatcher
    {
		public void afterTextChanged(Editable s) {
			
			String weight=txtWeight.getText().toString().trim();
			//如果输入的weight合法，则得到相应的表编号
			if(Tools.checkWeight(weight))
			{
				weightEnter=Double.parseDouble(weight);  //得到输入的重量
				formNum=Tools.getFormNumByWeight(weightEnter);
				loadSpinner();
				//Toast.makeText(getApplicationContext(), weight+",第"+formNum+"张表", Toast.LENGTH_LONG).show();
			}else{
				//置空
				unloadSpinner();
				setTxtDisable();
				showPrice("","","");
				formNum=0;
			}
				
		}

		public void beforeTextChanged(CharSequence s, int start, int count,int after) {
	
		}

		public void onTextChanged(CharSequence s, int start, int before,int count) {	
			
		}
    	
    }//end class TxtWeightChangeListener
    
    //**********************单价输入框txtUnitPrice监听类
    private class TxtUnitPriceListener implements TextWatcher
    {
		public void afterTextChanged(Editable s) 
		{
			if(txtUnitPrice.isFocused()) //如果自己是焦点，才执行
			{
				String price=txtUnitPrice.getText().toString();
				if(price.equals(""))
					   unitPriceEnter=0;
				else
					   unitPriceEnter=Double.parseDouble(price);
				
				if(rdbUS.isChecked()) //如果按美元显示
				{
					discountEnter=(int)(unitPriceEnter*100/US_unitPrice);
					totalPriceEnter=unitPriceEnter*weightEnter;
					//showPrice(df.format(unitPriceEnter),df.format(discountEnter) , df.format(totalPriceEnter));	
					txtDiscount.setText(df.format(discountEnter));  //折扣显示相应变化
					txtTotalPrice.setText(df.format(totalPriceEnter));   //总价显示相应变化
				}else{ //按人民币显示
					
					discountEnter=(int)(unitPriceEnter*100/RMB_unitPrice);
					//Toast.makeText(getApplicationContext(), discountEnter+"", Toast.LENGTH_LONG).show();
					totalPriceEnter=unitPriceEnter*weightEnter;
					txtDiscount.setText(df.format(discountEnter));  //折扣显示相应变化
					txtTotalPrice.setText(df.format(totalPriceEnter));   //总价显示相应变化
				}
			}//end if focused
		}

		public void beforeTextChanged(CharSequence s, int start, int count,
				int after) {
		}

		public void onTextChanged(CharSequence s, int start, int before,
				int count) {
			
		}
    	
    }// end class TxtUnitPriceListener
    
    //**********************折扣输入框txtDiscount监听类
    private class TxtDiscountListener implements TextWatcher
    {

		public void afterTextChanged(Editable s) {
			if(txtDiscount.isFocused())  //是焦点才执行
			{
				String _discount=txtDiscount.getText().toString();
				if(_discount.equals(""))
					   discountEnter=0;
				else
					   discountEnter=Double.parseDouble(_discount);
				
				if(rdbUS.isChecked()) //如果按美元显示
				{
					unitPriceEnter=US_unitPrice*discountEnter/100;
					totalPriceEnter=unitPriceEnter*weightEnter;
					//showPrice(df.format(unitPriceEnter),df.format(discountEnter) , df.format(totalPriceEnter));	
					txtUnitPrice.setText(df.format(unitPriceEnter));  //单价显示相应变化
					txtTotalPrice.setText(df.format(totalPriceEnter));   //总价显示相应变化
				}else{ //按人民币显示
					unitPriceEnter=RMB_unitPrice*discountEnter/100;
					totalPriceEnter=unitPriceEnter*weightEnter;
					//showPrice(df.format(unitPriceEnter),df.format(discountEnter) , df.format(totalPriceEnter));	
					txtUnitPrice.setText(df.format(unitPriceEnter));  //单价显示相应变化
					txtTotalPrice.setText(df.format(totalPriceEnter));   //总价显示相应变化
				}
			}// end is  isFocused					
		}

		public void beforeTextChanged(CharSequence s, int start, int count,
				int after) {
			
		}

		public void onTextChanged(CharSequence s, int start, int before,
				int count) {
		 
		}
    	
    }//end class TxtDiscount
    
    //**********************总价输入框txtPrice监听类
    private class TxtTotalPriceListener implements TextWatcher
    {
		public void afterTextChanged(Editable s) {
			if(txtTotalPrice.isFocused())  //是焦点才执行
			{
				String total=txtTotalPrice.getText().toString();
				if(total.equals(""))
					   totalPriceEnter=0;
				else
					totalPriceEnter=Double.parseDouble(total);
				
				if(rdbUS.isChecked()) //如果按美元显示
				{
					unitPriceEnter=totalPriceEnter/weightEnter;
					discountEnter=unitPriceEnter*100/US_unitPrice;
					//showPrice(df.format(unitPriceEnter),df.format(discountEnter) , df.format(totalPriceEnter));
					txtDiscount.setText(df.format(discountEnter));
					txtUnitPrice.setText(df.format(unitPriceEnter));  //单价显示相应变化
				}else{ //按人民币显示
					unitPriceEnter=totalPriceEnter/weightEnter;
					discountEnter=unitPriceEnter*100/RMB_unitPrice;
					//showPrice(df.format(unitPriceEnter),df.format(discountEnter) , df.format(totalPriceEnter));
					txtDiscount.setText(df.format(discountEnter));
					txtUnitPrice.setText(df.format(unitPriceEnter));  //单价显示相应变化
				}
			}// end is  isFocused	
			
		}

		@Override
		public void beforeTextChanged(CharSequence s, int start, int count,
				int after) {
		}

		@Override
		public void onTextChanged(CharSequence s, int start, int before,
				int count) {
			
		}
    	
    }
    
    //******************颜色下拉列表spinnerColor的监听类
    private class SpinnerColorListener implements OnItemSelectedListener
    {
		public void onItemSelected(AdapterView<?> arg0, View arg1, int arg2,long arg3) 
		{
			colorIndex=arg2;
			if(formNum!=0) //如果是18张表中的一张
			{
				calculation(); //计算
				//Toast.makeText(getApplicationContext(), colorIndex+"", Toast.LENGTH_LONG).show();
				arg0.setVisibility(View.VISIBLE);
			}else
				;//Toast.makeText(getApplicationContext(), colorIndex+",formNum=0", Toast.LENGTH_LONG).show();
		}

		public void onNothingSelected(AdapterView<?> arg0) 
		{
			
		}
    }//end class SpinnerColorListener
    
  //******************净重下拉列表spinnerNet的监听类
    private class SpinnerNetListener implements OnItemSelectedListener
    {
	public void onItemSelected(AdapterView<?> arg0, View arg1, int arg2,long arg3)
	{
		netIndex=arg2;
		if(formNum!=0) //如果是18张表中的一张
		{
			calculation(); //计算
			//Toast.makeText(getApplicationContext(), netIndex+"", Toast.LENGTH_LONG).show();
			arg0.setVisibility(View.VISIBLE);
		}else
			;
	}

	public void onNothingSelected(AdapterView<?> arg0) {
			
	}

    }//end class SpinnerNetListener
    
    //******************单选按钮组radioGroup1的监听类
    private class RdbChangedListener implements OnCheckedChangeListener
    {
		public void onCheckedChanged(RadioGroup group, int checkedId) 
		{
			if(formNum!=0)  
			{
				double exchangeRate = Double.parseDouble(paras[2]);
				if(checkedId==rdbUS.getId())  //如果是选中美元
				{
				   //把显示的人民币换成美元
					unitPriceEnter=unitPriceEnter/exchangeRate;
					totalPriceEnter=totalPriceEnter/exchangeRate;
					txtUnitPrice.setText(df.format(unitPriceEnter));
					txtTotalPrice.setText(df.format(totalPriceEnter));
				   //Toast.makeText(getApplicationContext(), "美元", Toast.LENGTH_LONG).show();	
				}else{
					unitPriceEnter=unitPriceEnter*exchangeRate;
					totalPriceEnter=totalPriceEnter*exchangeRate;
					txtUnitPrice.setText(df.format(unitPriceEnter));
					txtTotalPrice.setText(df.format(totalPriceEnter));
					//Toast.makeText(getApplicationContext(), "人民币", Toast.LENGTH_LONG).show();
				}
			}
			else
				setTxtDisable();
		}
    	
    }//end class RdbChangedListener
    
}//end class DiamoPrice