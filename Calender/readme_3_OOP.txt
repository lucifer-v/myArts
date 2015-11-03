version_3
版本3(相对于v2):
上次修改时间:
1."上个月"日期和"下个月"日期用浅色显示，并给予
  cld_lastMon|cld_nextMon
2.对于本月，使用cld_curMon,对于当前年月日使用cld_today
3.创建CldDate类
  m_year|m_month|m_day|m_week
4.注意：prototype方法是可以声明提前的

OOP
约定
1.1900-01-01为星期一
2.week表示星期|day表示几号
3.所有的样式前缀为"cld_"
4.引入jq.1.7.2
5.如果时间小于19000101则恒为19000101
6.星期一到星期六为1--6，星期日为0

功能
1.点击日历栅格的情况
  1.如果是本月的时间,则弹出对话框显示被点击的日期
  2.如果点击的是上月时间,那么日历向前显示一个月
  3.如果点击的是下月时间,那么日历向后显示一个月

【Class-CldDate】
构造函数:
CldDate(_dateStr, _splitter="")
数据成员：
this.m_dateStr		//给定的日期字符串
this.m_splitter		//年月日分隔符
this.m_year			//i-年份
this.m_month		//i-月份
this.m_day			//i-几号
this.m_week		//i-星期
类数据:
CldDate.prototype.leapYrMonths[]
CldDate.prototype.nonLeapYrMonths[]
类方法:
CldDate.toString()
CldDate.prototype.isLeapYear(_year)
CldDate.prototype.paddingZero(_month)
CldDate.prototype.getFirstDayDate()
CldDate.prototype.getLastDayDate()

CldDate.prototype.addDay()
CldDate.prototype.minusDay()
Calendar.prototype.addMonth()
Calendar.prototype.minusMonth()
Calendar.prototype.addYear()
Calendar.prototype.minusYear()

CldDate.prototype._diffDays()
CldDate.prototype._calculateWeek(int _diffDay)

【Class-Calender】
构造函数:
Calendar(char _splitter="", obj _styleOpts=null, int _cldRows=5, int _cldCols=7)

数据成员:
Calendar.m_cldRows
Calendar.m_cldCols
Calendar.m_styleOpts		//日历样式配置文件

Calendar.m_toDate		//今日日期,用于恢复到m_curDate
Calendar.m_curDate		//当前日期
Calendar.m_curCalendarDatas	//日历目前所使用的日历数据(二维数组)
注意：不能使用Calendar.m_toDate=Calendar.m_curDate=XXX
否则会指向同一个引用

类方法:
Calender.prototype.initCalendar(char _splitter)
Calender.prototype.toString()

Calender.prototype.buildCalendarData_en(CldDate _cldDate=null)
Calendar.prototype.buildCalendarData_cn(CldDate _cldDate=null)
Calendar.prototype.buildCalendarGrid_en(_lang='CN')
Calendar.prototype.buildCalendarGrid_cn(_lang='CN')
    
Calendar.prototype.displayYrMonth($_jqObj, _CldDate=null)

Calendar.prototype.addMonth()      //改变m_curDate,与m_curCalendarDatas
Calendar.prototype.minusMonth()
Calendar.prototype.addYear()
Calendar.prototype.minusYear()
Calendar.prototype.restoreDate()       //恢复m_curDate至m_toDate,与m_curCalendarDatas
Calendar.prototype.getCertainDateObj()	
Calendar.prototype.getFirstDateObj()   //从m_curCalendarDatas中取		
Calendar.prototype.getLastDateObj()    //同上

【view层】
#文件：calendar_3_view.html
#所有的CSS-class|CSS-id都需用插件类标识前缀"cld_"
   所有HTML控件CSS-class|CSS-id必须包括"cld_"以及"控件标识前缀"(如按钮为"btn_")
   类标识前缀在前，控件标识前缀在后，如cld_btn_back (返回)

#引用结构
<div class="cld_container"></div>

#功能完整结构
<label>日历格式</label>
	<select class="selc_cldFormatType" autocomplete="off">
		<option value="CN" selected="selected">中式</option>
		<option value="EN">西式</option>
	</select>
	<label>日历标题</label>
	<select class="selc_cldTitleType" autocomplete="off">
		<option value="CN" selected="selected">中文</option>
		<option value="EN">英文</option>
		<option value="NUM">数字</option>
	</select>
	<br /><br />
	
	<div class="cld_container">
			<div class="cld_header">
					<input type="button" class="cld_btn_lastYear" value="<<"/>
					<input type="button" class="cld_btn_lastMonth" value="<"/>
					<span class="cld_span_yrMonth">2014年9月</span>
					<input type="button" class="cld_btn_nextMonth" value=">"/>
					<input type="button" class="cld_btn_nextYear" value=">>"/>
					<input type="button" class="cld_btn_restore" value="还原" />
			</div>
			<div class="cld_body"></div>
	</div>
#相关HTML控件
.cld_selc_formatType
.cld_selc_titleType

.cld_btn_lastYear
.cld_btn_lastMonth
.cld_btn_nextMonth
.cld_btn_nextYear
.cld_btn_restore

.cld_span_yrMonth

.cld_body (div)

【CSS文件】
#文件名:calendar_3.css
#与样式相关的函数
Calendar::buildCalendarGrid_en()  undone  //注意上月和下月的判断 月份差要 区别跨年的情况(-1 1 11 -11)
Calendar::buildCalendarGrid_cn()  done
#相关样式类
日历栅格本身:cld_calendarGrid
日历栅格title:cld_calendaGrid th

上个月日期格子样式:cld_lastMthStyle
本月日期格子样式:cld_curMthStyle
下个月日期字体颜色:cld_nextMthStyle
鼠标划过时样式:cld_mouseover
休息日样式:cld_weekend






    












