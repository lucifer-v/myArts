/*
  *@功能:返回日历对象Calender
  *				默认使用(西式)buildCalendarData_en()
  *@参数:
  *		[in] _splitter 年月日的分割符
  *		[in] _styleOpts 控制日历样式的css类对象
  *		[in] _cldRows 日历网格的行数
  *		[in] _cldCols 日历网格的列数
  *@成员函数:
  *		m_toDate		表示今日日期的CldDate对象,可用于还原日历
  *		m_curDate	表示用户通过点击按钮而使得日期发生变化后的CldDate对象
  *@此类依赖于CldDate
  *@注意：
  *		决定日历外观的样式:
  */
function Calendar(_splitter, _styleOpts, _cldRows, _cldCols){
		//default参数处理start
		var defaultArgs = {
				_splitter : "",
				_styleOpts : null,
				_cldRows : 5,
				_cldCols : 7
		};
		if(undefined == _splitter)		{	_splitter		= defaultArgs._splitter;		}
		if(undefined == _styleOpts) {	_styleOpts    = defaultArgs._styleOpts;	}
		if(undefined == _cldRows)	{	_cldRows		=	defaultArgs._cldRows;	}
		if(undefined == _cldCols)		{	_cldCols		= defaultArgs._cldCols;		}
		//default参数处理end

		this.m_cldRows  = _cldRows;
		this.m_cldCols	 = _cldCols;
		this.m_curCalendarDatas = null;

		//处理样式配置对象
		if(null == _styleOpts){
				this.m_styleOpts = {
						m_todayCls : ""
				}
		}else{
				this.m_styleOpts = _styleOpts;
		}//end if  

		this.m_toDate=this.initCalendar(_splitter);
		this.m_curDate=this.initCalendar(_splitter);

		this.buildCalendarData_en();			//默认使用"西式"
}//end func-Calendar 
 
/*
  *@功能:显示当前日期(字符串)
  */
Calendar.prototype.toString = function(){
		return this.m_toDate.toString();
} 

 /*
   *@功能：初始化日历数据成员m_toDate|m_curDate
   *@参数：
   *		[in] _splitter 用于分割年/月/日的分隔符号
   *@返回值：表示今日日期的CldDate对象
   */
Calendar.prototype.initCalendar = function(_splitter){
		//default参数处理start
		var defaultArgs = {
				_splitter : ""
		};
		if(undefined == _splitter){	_splitter=defaultArgs._splitter;	}
		//default参数处理end

		var dt = new Date();
		var dateStr = "";
		dateStr += dt.getFullYear();
		dateStr += _splitter + ((dt.getMonth() < 9)	?	 '0' + (dt.getMonth() + 1)
																										:	'' + (dt.getMonth() + 1));
		dateStr += _splitter + ((dt.getDate() < 10)	?	'0' + (dt.getDate()) 
																									:	'' + dt.getDate());

		return new CldDate(dateStr, _splitter);
}//end func-initCalendar   

/*
  *@功能：根据给定的CldDate对象所在的月份
  *				   形成一个待构成日历的CldDate数组(西方习惯)
  *				   设置数据成员m_curCalendarDatas
  *@参数：
  *		[in] _cldDate 给定的cldDate对象
  *				如果_cldDate=null,则显示本月
  *@伪代码：
  *		1.如果提供了_cldDate,那么应该为m_curDate赋其值
  *		2.获取待显示的日期CldDate对象
  *		3.获取此日期下该月份的第一天的日期CldDate对象和最后一天CldDate对象
  *		4.填充本月的CldDate对象到数组paddingDates中
  *		5.填充上个月的日期对象到数组paddingDates中
  *		6.填充下个月的日期对象到数组paddingDates中
  */
Calendar.prototype.buildCalendarData_en = function(_cldDate){
		//defaultArgs-start
		var defaultArgs = {
				_cldDate : null
		};
		if(undefined == _cldDate){	_cldDate = defaultArgs._cldDate;	}
		//defaultArgs-end
		
		if(null != _cldDate){	this.m_curDate=_cldDate;	}
		var targetDt=this.m_curDate;

		//计算targetDt对应月份的firstDayDate|lastDayDate
		var firstDayDt = targetDt.getFirstDayDate(),
				lastDayDt  = targetDt.getLastDayDate();

		//填充日历数据数组
		//填充本月
		var paddingDates = new Array();		
		var tmpDt = firstDayDt;
		for(	 var i = firstDayDt.m_day; i <= lastDayDt.m_day; tmpDt = tmpDt.addDay(), i++){
				paddingDates.push(tmpDt);
		};

		//填充日历首端
		var numOfDaysToPad = firstDayDt.m_week;
		for(var i = 0, tmpDt = firstDayDt.minusDay(); i < numOfDaysToPad; i++, tmpDt=tmpDt.minusDay()){
				paddingDates.unshift(tmpDt);
		}
		
		//填充日历尾端
		var totalPads = this.m_cldRows * this.m_cldCols;			//需要填充的方格总数
		for(tmpDt = lastDayDt.addDay(); paddingDates.length < totalPads; tmpDt=tmpDt.addDay()){
				paddingDates.push(tmpDt);
		}

		//构建calendarDatas(数组)
		var calendarDatas=new Array(this.m_cldRows);
		var count=0;
		for(var i=0; i<this.m_cldRows; i++){
				calendarDatas[i]=new Array(this.m_cldCols);
				for(var j=0; j<this.m_cldCols; j++){
						calendarDatas[i][j]=paddingDates[count++];
				}
		}

		this.m_curCalendarDatas=calendarDatas;
}//end func-buildCalendarData_en 

/*
  *@功能：创建calendar对象的控制条，将其复制给m_controlBar
  */
Calendar.prototype.buildControlBar = function(){
		var ctrlBarHtml = '<table class="cld_tb_controlBar"><tbody><tr>'+
											'<td><span class="cld_btn_lastYr">&lt;&lt;</span></td>'+
											'<td><span class="cld_btn_lastMth">&lt;</span></td>'+
											'<td colspan="3"><span class="cld_span_monthYr">'+this.m_toDate.toString()+'</span></td>'+
											'<td><span class="cld_btn_nextMth">&gt;</span></td>'+
											'<td><span class="cld_btn_nextYr">&gt;&gt;</span></td>'+
											'</tr></tbody></table>';

		return ctrlBarHtml;
}//end func-buildControlBar
		
/*
  *@功能：在table中显示出数据成员m_curCalendarDatas的内容，西方格式(星期日在前)
  *@参数：
  *		[in] string _日历栅格的title [CN|EN|NUM] 默认为
  *@返回值: 返回日历的html字符串
  *@注意：
  *		此方法将m_curCalendarDatas用table显示出来
  *		必须配合方法buildCalendarDate_en()使用,即使用之前必先调用buildCalendarDate_en()
  *		以使m_curCalendarDatas保持西式日历序列
  */
Calendar.prototype.buildCalendarGrid_en=function(_lang){
		//defaultArgs--start
		var defaultArgs = {
				_lang : "CN"
		};
		if(undefined == _lang){	_lang = defaultArgs._lang;	}
		//defaultArgs--end

		var htmlStr = '<table class="cld_tb_calendarGrid">';
				
		switch(_lang){
				case 'CN'	:
						  htmlStr += '<thead><th>星期日</th><th>星期一</th><th>星期二</th><th>星期三</th>' + 
											    '<th>星期四</th><th>星期五</th><th>星期六</th>';
						  break;
				case 'EN'	:
						  htmlStr += '<thead><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th>' + 
											    '<th>THU</th><th>FRI</th><th>SAT</th>';
						  break;
				case 'NUM'	:
						  htmlStr += '<thead><th>日</th><th>一</th><th>二</th><th>三</th>' + 
												 '<th>四</th><th>五</th><th>六</th>';
						  break;
		}//switch

		htmlStr += '<tbody>';
		for(var i = 0; i < this.m_cldRows; i++){
				htmlStr += '<tr>';
				for(var j = 0; j < this.m_cldCols; j++){
						htmlStr += '<td style="border:1px solid #000;width:50px;">' + this.m_curCalendarDatas[i][j].m_day + '</td>';
				}//for
				htmlStr += '</tr>';
		}//for
		htmlStr += '</tbody></table>';

		return htmlStr;
}//end func-buildCalendarGrid_en

/*
  *@功能：根据给定的CldDate对象所在的月份
  *					形成一个待构成日历的CldDate数组(中国习惯)
  *					设置数据成员m_curCalendarDatas
  *@参数：
  *		[in] _cldDate  给定的cldDate对象
  *				如果_cldDate=null,则显示本月
  *@返回值：
  *		返回不带标题的m_cldRows行m_cldCols列的日历CldDate数组
  *@伪代码：
  *		1.如果提供了_cldDate,那么应该为m_curDate赋其值
  *		2.获取待显示的日期CldDate对象
  *		3.获取此日期下该月份的第一天的日期CldDate对象和最后一天CldDate对象
  *		4.填充本月的CldDate对象到数组paddingDates中
  *		5.填充上个月的日期对象到数组paddingDates中
  *		6.填充下个月的日期对象到数组paddingDates中
  */
Calendar.prototype.buildCalendarData_cn = function(_cldDate){
		//defaultArgs--start
		var defaultArgs = {
				_cldDate : null
		};
		if(undefined == _cldDate){	_cldDate = defaultArgs._cldDate;	}
		//defaultArgs--end

		if(null != _cldDate){		this.m_curDate=_cldDate;	}
		var targetDt = this.m_curDate ;
		
		//计算targetDt对应月份的firstDayDate|lastDayDate
		var firstDayDt = targetDt.getFirstDayDate(),
				lastDayDt  = targetDt.getLastDayDate();
		
		//(中式格式)星期处理
		var firstWeek = firstDayDt.m_week,
				lastWeek = lastDayDt.m_week;
		
		if(0 == firstWeek){	firstWeek=7;	}
		if(0 == lastWeek){	lastWeek=7;	}
		
		//填充本月
		var paddingDates = new Array();
		var tmpDt = firstDayDt;
		for(var i = firstDayDt.m_day ; i <= lastDayDt.m_day; i++, tmpDt = tmpDt.addDay()){
				paddingDates.push(tmpDt);
		}

		//填充上个月的部分
		for(var i=1, tmpDt=firstDayDt.minusDay(); i<firstWeek; i++, tmpDt=tmpDt.minusDay()){
				paddingDates.unshift(tmpDt);
		}

		//填充下个月部分
		var totalPads = this.m_cldRows * this.m_cldCols;			//需要填充的方格总数
		for(tmpDt = lastDayDt.addDay(); paddingDates.length < totalPads; tmpDt = tmpDt.addDay()){
				paddingDates.push(tmpDt);
		}

		//构建calendarDatas 
		var calendarDatas = new Array(this.m_cldRows);
		var count = 0;
		for(var i = 0; i < this.m_cldRows; i++){
				calendarDatas[i] = new Array(this.m_cldCols);

				for(var j = 0; j < this.m_cldCols; j++){
						calendarDatas[i][j] = paddingDates[count++];
				}
		}

		this.m_curCalendarDatas = calendarDatas;
}//end buildCalendarData_cn

/*
  *@功能：在table中显示出calendarGrid的内容，中式(星期一在前)
  *@参数：
  *		[in] ary _calendarGrid 每月日历所对应的数据栅格
  *		[in] string _日历栅格的title [CN|EN|NUM] 默认为
  *@返回值: null
  */
Calendar.prototype.buildCalendarGrid_cn=function(_lang){
		//defaultArgs--start
		var defaultArgs = {
				_lang	:	"CN"
		};
		if(undefined == _lang){	_lang = defaultArgs._lang;	}
		//defaultArgs--end
		var htmlStr = '<table class="cld_tb_calendarGrid">';
				
		switch(_lang){
				case 'CN' :
						htmlStr += '<thead><tr><th>星期一</th><th>星期二</th><th>星期三</th>' + 
											  '<th>星期四</th><th>星期五</th><th>星期六</th><th>星期日</th></tr></thead>';
						break;
				case 'EN' :
						htmlStr += '<thead><tr><th>MON</th><th>TUE</th><th>WED</th>' +
										      '<th>THU</th><th>FRI</th><th>SAT</th><th>SUN</th></tr></thead>';
						break;
				case 'NUM' :
						htmlStr += '<thead><tr><th>一</th><th>二</th><th>三</th>' +
											   '<th>四</th><th>五</th><th>六</th><th>日</th></tr></thead>';
						break;
		}//switch

		htmlStr += '<tbody>';
		for(var i = 0; i < this.m_cldRows; i++){
				htmlStr += '<tr>';
				for(var j = 0; j < this.m_cldCols; j++){
						var cldDate = this.m_curCalendarDatas[i][j];		//日期数组中的当前CldDate对象

						//判断上月|本月|下月
						switch(cldDate.m_month - this.m_curDate.m_month){
								case 11 :	//上月跨年
								case -1  :	//上月
										htmlStr += '<td class="cld_lastMthStyle ';
										break;
								case 0   :	//本月
										htmlStr += '<td class="cld_curMthStyle ';
										break;
								case -11 :		//下月跨年
								case	 1  :		//下月
										htmlStr += '<td class="cld_nextMthStyle ';
										break;
								default :
										break;
						}//end switch

						//判断是否双休
						if(0 == cldDate.m_week || 6 == cldDate.m_week){
								htmlStr += ' cld_weekend ';
						}
						
						//判断是否本日
						if(cldDate.toString() == this.m_toDate.toString()){
								htmlStr += ' cld_today';
						}
						
						htmlStr += '"><span>' + cldDate.m_day + '</span></td>';
				}//for

				htmlStr += '</tr>';
		}//for

		htmlStr += '</tbody></table>';
		
		return htmlStr;
}//end func-buildCalendarGrid_en

/*
  *@功能:将给定的CldDate对象代表的年份月份显示在指定的HTML控件中
  *@参数：
  *		[in]	 $_jqObj 给定待显示年份和月份的HTML控件
  *		[in] _cldDate 给定的CldDate对象
  *@说明:
  *		如果没有提供_cldDate那么使用this.m_curDate
  */
Calendar.prototype.displayYrMonth = function($_jqObj, _cldDate){
		//defaultArgs--start
		var defaultArgs = {
				_cldDate : null
		};
		if(undefined == _cldDate){	_cldDate = defaultArgs._cldDate;	}
		//defaultArgs--end

		var curDate = (null == _cldDate) ? this.m_curDate : _cldDate ;
		var yearMonth = curDate.m_year + "年" + curDate.paddingZero(curDate.m_month) + "月";

		$_jqObj.html(yearMonth);
}//end func-displayYrMonth

/*
  *@功能：将当前的日期(数据成员m_curDate)提前一个月
  *@返回值；null
  */
Calendar.prototype.addMonth = function(){
		this.m_curDate = this.m_curDate.addMonth();
}

/*
  *@功能：将当前的日期(数据成员m_curDate)减少一个月
  *@返回值：null
  */
Calendar.prototype.minusMonth = function(){
		this.m_curDate = this.m_curDate.minusMonth();
}

/*
  *@功能：将当前的日期(m_curDate)增加一年
  *@返回值：null
  */
Calendar.prototype.addYear = function(){
		this.m_curDate = this.m_curDate.addYear();
}

/*
  *@功能：将当前的日期(m_curDate)减少一年
  *@返回值：null
  */
Calendar.prototype.minusYear = function(){
		this.m_curDate=this.m_curDate.minusYear();
} 

/*
  *@功能；将m_curDate的值还原成今日日期值(m_toDate)
  */
Calendar.prototype.restoreDate = function(){
		for(var prop in this.m_toDate){
				if("function" == typeof this.m_toDate[prop])	continue;
				if(this.m_toDate.hasOwnProperty(prop)){
						this.m_curDate[prop]=this.m_toDate[prop];
				}
		}//end for
}//end func-restoreDate

/*
  *@功能：根据 日期unit所在日历grid的位置(rowIndex, colIndex)元素
  *		获取对应的cldDate对象
  *返回值：_iRowIndex与_iColIndex位置的CldDate对象
  */
  Calendar.prototype.getCertainDateObj = function(_iRowIndex, _iColIndex){
		return this.m_curCalendarDatas[_iRowIndex][_iColIndex];
  }//end func-getCertianDateObj