$(function(){
	window.page = {
			/*selcSet*/
			selcSet : {
					cld_selc_formatType : $(".cld_selc_formatType"),
					cld_selc_titleType : $(".cld_selc_titleType"),
			},

			/*btnSet*/
			btnSet : {
					cld_btn_lastYear : $(".cld_btn_lastYear"),
					cld_btn_lastMonth : $(".cld_btn_lastMonth"),
					cld_btn_nextMonth : $(".cld_btn_nextMonth"),
					cld_btn_nextYear : $(".cld_btn_nextYear"),
					cld_btn_restore : $(".cld_btn_restore")
			},

			/*spanSet*/
			spanSet : {
					cld_span_yrMonth : $(".cld_span_yrMonth")
			},
			
			/*divSet*/
			divSet : {
					cld_body : $(".cld_body")
			},
			
			/*刷新calendar对象
			  *返回cldHtml字符串
			  */
			refreshCalendar : function(_calendar, _formatType, _titleType){
					var cldHtml = "";
					if("CN" == _formatType){
							_calendar.buildCalendarData_cn();
							cldHtml=_calendar.buildCalendarGrid_cn(_titleType);
					}else if("EN" == _formatType){
							_calendar.buildCalendarData_en();
							cldHtml=_calendar.buildCalendarGrid_en(_titleType);
					}

					return cldHtml;
			}//end func-refreshCalendar
	};//end page

	var selcSet = page.selcSet;
	var btnSet = page.btnSet;
	

	/*初始化日历*/
	var calendar = new Calendar("-");
	var initFormatType = selcSet.cld_selc_formatType.val();
	var initTitleType = selcSet.cld_selc_titleType.val();
	var cldHtml=page.refreshCalendar(calendar, initFormatType, initTitleType);

	page.divSet.cld_body.html(cldHtml);
	calendar.displayYrMonth(page.spanSet.cld_span_yrMonth);
	
	/*日历默认为"中式-中文"*/
	//日历格式selc|日历标题selc
	selcSet.cld_selc_formatType.add(selcSet.cld_selc_titleType).change(function(){
			var cldHtml="";
			var formatType=selcSet.cld_selc_formatType.val();
			var titleType=selcSet.cld_selc_titleType.val();

			cldHtml=page.refreshCalendar(calendar, formatType, titleType);
			page.divSet.cld_body.html(cldHtml);
			calendar.displayYrMonth(page.spanSet.cld_span_yrMonth);

	});//end selc-change

	//上一年按钮
	btnSet.cld_btn_lastYear.click(function(){
			var cldHtml="";
			var formatType=selcSet.cld_selc_formatType.val();
			var titleType=selcSet.cld_selc_titleType.val();
			
			calendar.minusYear();
			cldHtml=page.refreshCalendar(calendar, formatType, titleType);
			page.divSet.cld_body.html(cldHtml);
			calendar.displayYrMonth(page.spanSet.cld_span_yrMonth);

	});//end btn_lastYear-click

	//上一月按钮
	btnSet.cld_btn_lastMonth.click(function(){
			var cldHtml="";
			var formatType=selcSet.cld_selc_formatType.val();
			var titleType=selcSet.cld_selc_titleType.val();
			
			calendar.minusMonth();
			cldHtml=page.refreshCalendar(calendar, formatType, titleType);
			page.divSet.cld_body.html(cldHtml);
			calendar.displayYrMonth(page.spanSet.cld_span_yrMonth);
	});

	//下一月按钮
	btnSet.cld_btn_nextMonth.click(function(){
			var cldHtml="";
			var formatType=selcSet.cld_selc_formatType.val();
			var titleType=selcSet.cld_selc_titleType.val();
			
			calendar.addMonth();
			cldHtml=page.refreshCalendar(calendar, formatType, titleType);
			page.divSet.cld_body.html(cldHtml);
			calendar.displayYrMonth(page.spanSet.cld_span_yrMonth);
	});

	//下一年按钮
	btnSet.cld_btn_nextYear.click(function(){
			var cldHtml="";
			var formatType=selcSet.cld_selc_formatType.val();
			var titleType=selcSet.cld_selc_titleType.val();
			
			calendar.addYear();
			cldHtml=page.refreshCalendar(calendar, formatType, titleType);
			page.divSet.cld_body.html(cldHtml);
			calendar.displayYrMonth(page.spanSet.cld_span_yrMonth);
	
	});

	//还原按钮
	btnSet.cld_btn_restore.click(function(){
			var cldHtml="";
			var formatType=selcSet.cld_selc_formatType.val();
			var titleType=selcSet.cld_selc_titleType.val();
			
			calendar.restoreDate();

			cldHtml=page.refreshCalendar(calendar, formatType, titleType);
			page.divSet.cld_body.html(cldHtml);
			calendar.displayYrMonth(page.spanSet.cld_span_yrMonth);
			
	});
});//end func-jq-ready



