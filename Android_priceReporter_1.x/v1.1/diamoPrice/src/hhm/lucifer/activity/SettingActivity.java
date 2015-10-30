package hhm.lucifer.activity;

import hhm.lucifer.datas.Tools;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class SettingActivity extends Activity
{
   public void onCreate(Bundle savedInstanceState)
   {
	  super.onCreate(savedInstanceState);
	  setContentView(R.layout.setting);
	  
	  //确定按钮
	  Button btnConfirm=(Button)this.findViewById(R.id.btnConfirm);
	  btnConfirm.setOnClickListener(new BtnConfirmListener());
	  //返回按钮
	  Button btnButton=(Button)this.findViewById(R.id.btnBack);
	  btnButton.setOnClickListener(new BtnBackListener());
	  
    }//end onCreate()
	 
   
	//*****按钮btnConfirm的监听类 BtnConfirmListener
	private class BtnConfirmListener implements View.OnClickListener
	{
		public void onClick(View v) 
		{
			//显示txtExchange的内容
			EditText txtExchange=(EditText)findViewById(R.id.txtExchange);
			String exchange=txtExchange.getText().toString().trim();
			//如果exchange数字,则更改
			if(Tools.rateIsDouble(exchange))
			{
				//Toast.makeText(getApplicationContext(), exchange, Toast.LENGTH_LONG).show();
				//修改汇率,返回true或者false,修改成功，重新读取配置文件
				if(Tools.changeExchangeRate(exchange))					
					Toast.makeText(getApplicationContext(), "汇率修改成功", Toast.LENGTH_LONG).show();
				txtExchange.setText("");
			}
			else
			{
				txtExchange.setText("");
				Toast.makeText(getApplicationContext(), "请输入实数", Toast.LENGTH_LONG).show();
			}
		}//end onClick()
	}//end class BtnConfirmListener
	 
	//*****按钮btnBack的监听类BtnBackListener
	private class BtnBackListener implements View.OnClickListener
	{
		public void onClick(View v)
		{   
			Intent intent=new Intent();
			intent.setClass(SettingActivity.this, DiamoPriceActivity.class);
			startActivity(intent);
			finish();  //返回主页面
		}
	}//end class BtnBackListener

}//end class SettingActivity
