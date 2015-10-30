package hhm.lucifer.activity;

import java.util.ArrayList;
import java.util.List;

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
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.AdapterView.OnItemSelectedListener;

public class DiamoPriceActivity extends Activity {

	private CurrentPriceForms[] currentPriceForms = new CurrentPriceForms[19]; //将要存放数据的18张表,舍弃第一个不用
	private int formNum=0; //根据输入的价格选定表格的编号
	private int colorIndex; //comboColor中选定的值所对应的下标
	private int netIndex; //comboNet中选定的值所对应的下标
	private Spinner spinnerColor; //颜色下拉列表
	private Spinner spinnerNet;  //净度下拉列表
	private TextView txtRMB;
    private TextView txtUS;
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
     
        //获取两个显示单价的TXT对象
        txtRMB=(TextView)this.findViewById(R.id.txtRMB);
        txtUS=(TextView)this.findViewById(R.id.txtUS);
        
        //********************获取三个参数
        Tools.getIniParameters(paras);
        //生成并初始化18张表,利用Tools的initial()
        if(Tools.initial(this))
        	Toast.makeText(getApplicationContext(), "初始化成功", Toast.LENGTH_LONG).show();
        else
        	Toast.makeText(getApplicationContext(), "初始化失败", Toast.LENGTH_LONG).show();
        	
        //********************汇率按钮
        Button btnExchange=(Button)this.findViewById(R.id.btnExchange);
        btnExchange.setOnClickListener(new BtnExchangeListener());
        //********************设置按钮
        Button btnSet=(Button)this.findViewById(R.id.btnSet);
        btnSet.setOnClickListener(new BtnSetListener());
        //********************退出按钮
        Button btnExit=(Button)this.findViewById(R.id.btnExit);
        btnExit.setOnClickListener(new BtnExitListener());
        
        //监听txtWeight
        EditText txtWeight=(EditText)this.findViewById(R.id.txtWeight);
        txtWeight.addTextChangedListener(new TxtWeightChangeListener(txtWeight));
        
        spinnerColor=(Spinner)this.findViewById(R.id.spinnerColor);
        spinnerNet=(Spinner)this.findViewById(R.id.spinnerNet);
        unloadSpinner(); //初始化两个Spinner

    	
    	
        //为下拉列表设置各种事件的响应,这个是响应下拉菜单被选中
        spinnerColor.setOnItemSelectedListener(new SpinnerColorListener());
        spinnerNet.setOnItemSelectedListener(new SpinnerNetListener());

//        txtRMB.setText("11111");
//		txtUS.setText("22222");

    }//end onCreate()
    
   
    /***
     * 计算价格
     */
    public void calculation() {
		double rmbPrice = 0;
		double dollarPrice = 0;
		//得到表的编号
		int nub =formNum;
		//得到所选的颜色和净度下标
		int _colorIndex = colorIndex;
		int _netIndex = netIndex;
		//得到汇率
		double exchangeRate = Double.parseDouble(paras[2]);

		if (_netIndex >= 0 && _colorIndex >= 0) {
			if (nub <= 6)
				dollarPrice = this.getCurrentPriceForms()[nub].getLight_PriceForm()[_colorIndex][_netIndex]*100;
			else
				dollarPrice = this.getCurrentPriceForms()[nub].getWeight_PriceForm()[_colorIndex][_netIndex]*100;
		}

		//显示
		rmbPrice = exchangeRate * dollarPrice;
		txtRMB.setText(Tools.getCurrencyFormat(rmbPrice, "china"));
		txtUS.setText(Tools.getCurrencyFormat(dollarPrice,"america"));
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
    	
    	txtRMB.setText("￥0.00");
		txtUS.setText("＄0.00");
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
    
    //************************退出按钮的监听类
    private class BtnExitListener implements View.OnClickListener
    {
		public void onClick(View v)
		{
			//Toast.makeText(getApplicationContext(), "退出按钮", Toast.LENGTH_LONG).show();
			finish();
		}
    }//end class BtnExitListener
   
    //************************txtWeight监听类
    private class TxtWeightChangeListener implements TextWatcher
    {
    	EditText txtWeight;  //接收重量输入框这个对象
    	public TxtWeightChangeListener(EditText et)
    	{
    	   txtWeight=et;	
    	}
    	
		public void afterTextChanged(Editable s) {
			
			String weight=txtWeight.getText().toString().trim();
			//如果输入的weight合法，则得到相应的表编号
			if(Tools.checkWeight(weight))
			{
				double value=Double.parseDouble(weight);
				formNum=Tools.getFormNumByWeight(value);
				loadSpinner();
				//Toast.makeText(getApplicationContext(), weight+",第"+formNum+"张表", Toast.LENGTH_LONG).show();
			}else{
				unloadSpinner();
				formNum=0;
			}
				
		}

		public void beforeTextChanged(CharSequence s, int start, int count,int after) {
	
		}

		public void onTextChanged(CharSequence s, int start, int before,int count) {	
			
		}
    	
    }//end class TxtWeightChangeListener
    
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
			;//Toast.makeText(getApplicationContext(), netIndex+",formNum=0", Toast.LENGTH_LONG).show();
	}

	public void onNothingSelected(AdapterView<?> arg0) {
			
	}

    }//end class SpinnerNetListener
    
}//end class DiamoPrice