/*
  *@类:CldDate 表示日历中的每一天
  *@构造函数:
  *		使用一个日期字符串创建一个CldDate对象
  */
function CldDate(_dateStr, _splitter){
		//defaultArgs--start
		var defaultArgs = {
				_splitter : ""
		};
		if(undefined == _splitter){	_splitter = defaultArgs._splitter;	}
		//defaultArgs--end

		this.m_dateStr=_dateStr;
		this.m_splitter=_splitter;

		if(""==_splitter){
				this.m_year=parseInt(_dateStr.substring(0, 4));
				this.m_month=parseInt(_dateStr.substring(4, 6));
				this.m_day=parseInt(_dateStr.substring(6, 8));		
		}else{
				var components=_dateStr.split(_splitter);
				this.m_year=parseInt(components[0]);		
				this.m_month=parseInt(components[1]);
				this.m_day=parseInt(components[2]);
		};

		this.m_week=this._calculateWeek(this._diffDays());			//计算星期
}//end func-CldDate
		
CldDate.prototype.leapYrMonths=[31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
CldDate.prototype.nonLeapYrMonths=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		
/*
  *@功能:如果给定的月份值小于10，则在其前面添加'0'
  *@返回值:
  *		返回大于10的月份，或者前面带0的小于10的月份
  */
CldDate.prototype.paddingZero=function(_num){
		if(_num<10){	  _num='0'+_num;	}
		return ''+_num;
}

/*
  *@功能：判定给定年份是否是闰年
  *@参数：待判断其是否为闰年的年份
  *@返回值：
  *		true：是闰年
  *		false：不是闰年
  */
CldDate.prototype.isLeapYear = function(_year){
		if(	(0 == _year%400) ||
				(0 !=  _year%100 && 0 == _year%4)){
				return true;		
		}else{
				return false;
		}
}//end func-isLeapYear

/*
 *@功能：计算CldDate日期对象到19000101的相差天数
 *@返回值：
*		-1：	_dateStr中的年份少于1900
*		>=0：给定的年份相距1900/01/01的天数
*/
CldDate.prototype._diffDays=function(){
		var iDiffDay=0;
		var iStartYr=1900, iStartMth=1, iStartDay=1;			//计算天数所依据的 年份/月份/天数

		//输入年份偏小
		if(this.m_year<iStartYr){
				return -1;
		}
		
		//按年为单位计算
		while(iStartYr<this.m_year){
				iDiffDay+=(this.isLeapYear(iStartYr)?366:365);
				iStartYr++;
		}

		//按月为单位计算
		while(iStartMth<this.m_month){
				iDiffDay+=(this.isLeapYear(iStartYr)?this.leapYrMonths[iStartMth-1]:this.nonLeapYrMonths[iStartMth-1]);
				iStartMth++;
		}

		//按天为单位计算
		iDiffDay+=(this.m_day-iStartDay);

		return iDiffDay;
}//end func-_diffDays

/*
  *@功能：根据相差天数来计算当天星期几
  *@参数：
  *		[in] int  _diffDay--与1900/01/01相差的天数
  *@返回值：
  *		[0=星期日|1=星期一|...]
  */
CldDate.prototype._calculateWeek=function(_diffDay){

		return (_diffDay+1)%7;
}//end func-_calculateWeek

/*
  *@功能：将CldDate对象转换为日期字符串
  *@返回值：日期字符串
  */
CldDate.prototype.toString=function(){
		return this.m_dateStr;
}//end func-toString

/*
  *@功能：将当前日期对象增加一天
  *@返回值：返回增加以后的CldDate对象
  *@注意：
  *		[1]-年份不能超过2100，不能小于1900
  */
CldDate.prototype.addDay=function(){
		var		year = this.m_year,
				month = this.m_month,
					  day = this.m_day;
		
		//1.判断是否需要跨月份
		if(this.isLeapYear(year)){		//闰年情形
				if(day+1>this.leapYrMonths[month-1]){
						month++;
						day=1;
				}else{
						day++;
				}

		}else{		//非闰年情形
				if(day+1>this.nonLeapYrMonths[month-1]){
						month++;
						day=1;
				}else{
						day++
				}

		}//end if

		//判断是否需要跨年
		if(month>12){	
				month=1;
				year++;
		}

		//2.判断是年份否超过2100
		if(year>2100){	 year=2100;	}

		var nextDayDateStr=""+year+this.m_splitter+this.paddingZero(month)+this.m_splitter+
			          this.paddingZero(day);

		return new CldDate(nextDayDateStr, this.m_splitter);
}//end func-addDady

/*
  *@功能：将当前日期对象减少一天
  *@返回值：返回减少以后的CldDate对象
  *@注意：
  *		[1]-年份不能超过2100，不能小于1900
  */
CldDate.prototype.minusDay=function(){
		var		year = this.m_year,
				month = this.m_month,
					  day = this.m_day;
		
		//1.判断是否需要跨月份
		day--;
		if(0 == day){		//跨月份
				month--;
				if(0 == month){		//2.判断是否需要跨年份
						year--;
						month = 12;
				}
				
				//3.判断年份是否越界
				if(year < 1900){		year = 1900;	}

				//确定天数
				day = this.isLeapYear(year)	 ?  this.leapYrMonths[month-1]
																		  :  this.nonLeapYrMonths[month-1];
		}//end if
		
		var nextDayDateStr = "" + year + this.m_splitter + this.paddingZero(month) + this.m_splitter + 
													this.paddingZero(day);
		
		return new CldDate(nextDayDateStr, this.m_splitter);
}//end func-addDady

/*
  *@功能:将当前日期提前一个月，day初始化为01
  *@返回值:新日期CldDate对象
  *@约束:year不能大于2100
  */
CldDate.prototype.addMonth = function(){
		var		 year = this.m_year,
			     month = this.m_month,
					 day  =  this.m_day;

		//处理月份
		if(month + 1 > 12){
				year++;
				month = 1;
		}else{
				month++;
		}

		//处理年份
		if(year > 2100){		year = 2100;	}

		return new CldDate("" + year +this.m_splitter + this.paddingZero(month) + 
					  this.m_splitter + this.paddingZero(1), this.m_splitter);
}//end func-addMonth

/*
  *@功能:将当前日期提前一个月，day初始化为01
  *@返回值:提前以后的日期所对应的CldDate对象
  *@约束:如果m_year<1900则m_year=1900
  */
CldDate.prototype.minusMonth=function(){
		var  year	  = this.m_year,
				month = this.m_month,
				day       = this.m_day;

		//处理月份
		if(0 == month-1){
				year--;
				month = 12;
		}else{
				month--;
		}

		//处理年份
		if(year < 1900){	year = 1900;	}

		return new CldDate("" + year +this.m_splitter + this.paddingZero(month) + 
					  this.m_splitter + this.paddingZero(1), this.m_splitter);
}//end func-minusMonth

/*
  *@功能:将当前日期提前一年，day初始化为01
  *@返回值:新日期对应的CldDate对象
  *@约束:如果m_year>2100则m_year=2100
  */
CldDate.prototype.addYear=function(){
		var year		= this.m_year,
				month	= this.m_month,
				day			= this.m_day;

		if(year + 1 > 2100){		
				year = 2100;	
		}else{
				year++;
		}
				
		return new CldDate("" + year + this.m_splitter + this.paddingZero(month) + 
						this.m_splitter + this.paddingZero(1), this.m_splitter);
}//end func-addYear

/*
  *@功能:将当前日期提前一年，day初始化为01
  *@返回值:返回新日期的CldDate对象
  *@约束:如果m_year<1900则m_year=1900
  */
CldDate.prototype.minusYear = function(){
		var year		= this.m_year,
			   month	= this.m_month,
			   day			= this.m_day;

		if(year - 1 < 1900){		
				year=1900;	
		}else{
				year--;
		}
				
		return new CldDate("" + year + this.m_splitter + this.paddingZero(month) + 
								this.m_splitter + this.paddingZero(1), this.m_splitter);
}//end func-minusYear

/*
  *@功能:计算m_dateStr日期中该月份下第一天的CldDate
  *@返回:CldDate对象
  */
CldDate.prototype.getFirstDayDate = function(){
		var firstDayDateStr="" + this.m_year + this.m_splitter + this.paddingZero(this.m_month) +
												 this.m_splitter + this.paddingZero(1);

		return new CldDate(firstDayDateStr, this.m_splitter);
}//end func-getFirstDayDate

/*
  *@功能:计算m_dateStr日期中该月份下最后一天的CldDate
  *@返回:CldDate对象
  */
CldDate.prototype.getLastDayDate = function(){
		var iLastDay = this.isLeapYear(this.m_year) ? this.leapYrMonths[this.m_month-1]
																								: this.nonLeapYrMonths[this.m_month-1];
		var lastDayDateStr="" +this.m_year + this.m_splitter + this.paddingZero(this.m_month) +
												this.m_splitter + this.paddingZero(iLastDay);

		return new CldDate(lastDayDateStr, this.m_splitter);
}//end func-getLastDayDate