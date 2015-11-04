$(function(){
	/*[公共]
	  *刷新日历单元格的'任务标识'
	  */
	 function refreshTaskFlag(_memoCld, _triggerType){
			var toDate = _memoCld.m_toDate;
			var selectedDate = getSelectedDate(_memoCld);
			
			switch(_triggerType){
					case TASKFLAG_REFRESH_CREATE : {	//创建任务
							selectedDate.totalTaskNum++;
							break;
					}
					case TASKFLAG_REFRESH_DELETE : {	//删除任务
							selectedDate.totalTaskNum--;
							selectedDate.taskDoneNum--;
							break;
					}
					case TASKFLAG_REFRESH_DONE : {		//完成任务
							selectedDate.taskDoneNum++;
							break;
					}
					case TASKFLAG_REFRESH_UNDONE : {		//撤销任务完成
							selectedDate.taskDoneNum--;
							break;
					}
			}//switch

			//处理"任务标识"
			var $cldUnit = getSelectedCldUnit();
			var $flagSpan = $cldUnit.find("span.memo_taskCompFlag");

			$flagSpan.removeClass("memo_ico_tasktodo memo_ico_taskundo");		//撤销全部"任务标识"样式
			if( 0 == selectedDate.totalTaskNum || 
				selectedDate.totalTaskNum == selectedDate.taskDoneNum ){		//如果没有代办任务
					return;
			}
			
			//如果仍有代办任务
			if(selectedDate.toString() < toDate.toString()){
					$flagSpan.addClass("memo_ico_taskundo");
			}else{
					$flagSpan.addClass("memo_ico_tasktodo");
			}
	 }//end func-refreshTaskFlag

	 /*[公共]
	   *打开全局标识g_creating
	   */
	 function turnCreatingFlagOn(){
			g_creating = true;
	 }//end func-turnCreatingFlagOn

	 /*[公共]
	   *关闭全局标识g_creating
	   */
	  function turnCreatingFlagOff(){
			g_creating = false;
	  }//end func-turnCreatingFlagOff

	  /*[公共]
	   * 检测全局标识g_creating
	   */
	 function checkCreatingFlag(){
			return g_creating;
	 }
	
	/*[公共]
	  *功能：标识是否是通过搜索获取的任务列表
	  *打开 "搜索任务"标识
	  */
	function turnBySearchFlagOn(){
			g_bySearch = true;
	}

	/*[公共]
	  *关闭 "搜索任务"标识
	  */
	function turnBySearchFlagOff(){
			g_bySearch = false;
	}

	/*[公共]
	  *检测全局"搜索任务"标识
	  */
	 function checkBySearchFlag(){
			return g_bySearch;
	 }

	/*[公共]
	  *获取搜索字符串
	  */
	  function getSrhContent(){
			return $("#memo_txt_srh").val().trim();
	  }//end

	/*[公共]
	  *给定日期对象是否在今日日期之前
	  */
	 function isDateBeforeToday(_specifiedCldDate, _memoCld){
			return _specifiedCldDate.toString() < _memoCld.m_toDate.toString();
	 }//end
	
	/*[公共]
	  *清除搜素栏内容
	  */
	 function clearSearhContent(){
			$("#memo_txt_srh").val("");
	 }//end

	/*[日历面板]
	  *获得待显示的"日期字符串"
	  */
	function getDateToShow(_memoCld){
			var curYr = _memoCld.m_curDate.m_year;
			var curMth = _memoCld.m_curDate.m_month;
			var curDateStr = curYr+"&nbsp;年&nbsp;"+curMth+"&nbsp;月";
			return curDateStr;
	}//end func

	/*[日历面板]
      *处理上个月"未完成"标识按钮
	  *@参数: undoneFlag 未完成标识
	  */
	  function handleLastMthTaskFlag(_undoneFlag){
			if(1 == _undoneFlag){
					$("#memo_btn_lastmth").addClass("memo_ico_lastmth_taskundo")
																	   .removeClass("memo_ico_lastmth");									 
			}else{
					$("#memo_btn_lastmth").addClass("memo_ico_lastmth")
																	   .removeClass("memo_ico_lastmth_taskundo");
			}
	  }//end func

	 /*[日历面板]
	   *刷新日历面板
	   */
	function refreshCalendarBoard(_undoneFlag, _taskCompInfo, _memoCld){
			//添加上月未完成任务标识
			handleLastMthTaskFlag(_undoneFlag);

			//加载日历单元格
			memoCld.attachTaskInfoToUnitDate(_taskCompInfo);			//添加任务完成属性
			var cldGrid = memoCld.buildCalendarGrid_cn("NUM");		//获取日历单元格
			$("#memo_the_cld").html(cldGrid);		//填充日历
									
			var dateStr = getDateToShow(_memoCld);			//加载当前年月								
			$("#memo_span_curDate").html(dateStr);

			disableEditboard();			//禁用编辑面板
			clearMsgList()					//清空任务列表
			clearOprtList();					//清除操作列表
			hideBtnCreateTask();	 	//关闭"新建任务"按钮
			closeGpListBoard();		//关闭组列表
			turnCreatingFlagOff();	//关闭"正在创建标识"
	}//end func
	
	/*[编辑面板]
	  *禁用消息编辑栏
	  */
	function disableEditboard(){
			var $subjboard = $(".memo_msgSubject_edit", "#memo_out_container");			//主题面板
			var $commboard = $(".memo_msgComment_edit", "#memo_out_container");		//备注面板
			var $attrbar = $(".memo_msg_attrbar", "#memo_out_container");		//属性面板
			var $optbar = $(".memo_msgdtl_opts", "#memo_out_container");		//操作条
			
			//禁用主题|备注面板
			$subjboard.prop("contenteditable", false).text("").addClass("memo_subjboard_disable");
			$commboard.prop("contenteditable", false).text("").addClass("memo_commboard_disable");
			//禁用消息属性条
			$attrbar.children("span").text("");
			$attrbar.addClass("memo_attrbar_disable");

	}//end func-disableEditboard

	/*[编辑面板]
	  *启用消息编辑栏(会根据自建消息和接受消息开启不用的块)
	  */
	function enableEditboard(_taskObj){
			var $subjboard = $(".memo_msgSubject_edit", "#memo_out_container");			//主题面板
			var $commboard = $(".memo_msgComment_edit", "#memo_out_container");		//备注面板
			var $attrbar = $(".memo_msg_attrbar", "#memo_out_container");		//属性面板
			var $optbar = $(".memo_msgdtl_opts", "#memo_out_container");		//操作条
			var bIsReciver = _taskObj.creator != _taskObj.reciver;
			
			//启用主题|备注面板, 启用之前先禁用，以考虑从一个消息切换到另一消息的情况
			$subjboard.addClass("memo_subjboard_disable").prop("contenteditable", false);
			$commboard.addClass("memo_commboard_disable").prop("contenteditable", false);

			if(hasSaveOperation(_taskObj)){		//如果含有"更新"操作
					if( !bIsReciver && !checkBySearchFlag()){		//如果是创建者并且不是由搜索得到,打开主题面板
							$subjboard.prop("contenteditable", true).removeClass("memo_subjboard_disable");
						}
					$commboard.prop("contenteditable", true).removeClass("memo_commboard_disable");
			}

			//启用消息属性条
			if( bIsReciver ){
					$("#memo_span_msg_type", $attrbar).text("来自:");
			}else{
					$("#memo_span_msg_type", $attrbar).text("自建:");
			}
			$("#memo_span_msg_relativeperson", $attrbar).text(_taskObj.creator);
			$("#memo_span_msg_createdate", $attrbar).text(_taskObj.datetime);
			$attrbar.removeClass("memo_attrbar_disable");
	}//end func-enableEditboard

	/*[编辑面板]
	  *主题是否已经更新
	  */
	  function isSubjectUpdated(_taskObj, _$subjBoard){
			return _taskObj.subject != _$subjBoard.text().trim();
	  }

	/*[编辑面板]
	  *备注是否已经更新
	  */
	  function isCommentsUpdated(_taskObj, _$commentsBoard){
			return _taskObj.comments != _$commentsBoard.text().trim();		
	  }

	/*[编辑面板]
	  *主题是否为空
	  */
	function isSubjectEmpty(){
			return ("" == $(".memo_msgSubject_edit", "#memo_out_container").text().trim());
	}//end func
	
	/*[编辑面板]
	  * 获取主题内容
	  * 需要保存换行符，获取html()后，添加一行实际上是
	  */
	function getSubject(){
			return $(".memo_msgSubject_edit", "#memo_out_container").text().trim();
	}//end func

	/*[编辑面板]
	  * 获取主题内容
	  *需要保存换行符
	  */
	function getComments(){
			return $(".memo_msgComment_edit", "#memo_out_container").text().trim();
	}//end func

	/*[编辑面板]
	  *更新验证
	  *已经更新 返回true ; 没有更新 返回false
	  */
	  function updatedVerify(_taskObj){
			var $subjBoard = $(".memo_msgSubject_edit", "#memo_out_container");						//主题编辑栏
			var $commentsBoard = $(".memo_msgComment_edit", "#memo_out_container");	//备注编辑栏
			var bIsReciver = getIsReciverOfSelectedTask();

			if( bIsReciver && isCommentsUpdated(_taskObj, $commentsBoard) ){		//接收者情况
					return true;
			}

			if( !bIsReciver &&	 
				  (  isSubjectUpdated(_taskObj, $subjBoard) ||
					  isCommentsUpdated(_taskObj, $commentsBoard ) ) ){	//创建者情况
					return true; 
			}

			return false;
	  }//end updatedVerify

	/*[消息列表面板]
	  *加载任务到任务列表
	  */
	function loadTaskToMsglist(_taskList){
			var listSize = _taskList.length;
			var $tbody = $(".memo_msglst_container tbody", "#memo_out_container");
		
			var trHtml = '';
			$tbody.empty();
			for(var i = 0; i < listSize; i++){
					var task = _taskList[i];
					var iIsReciver = (task.creator != task.reciver)? 1 : 0 ;
					var subjectDigest = truncateStr(task.subject, 25, "...");

					trHtml += '<tr data-task-no="'+task.task_no+'" data-oth-reciver="'+task.oth_reciver+
											 '" data-is-reciver="'+iIsReciver+'">';
										 
					if(checkBySearchFlag()){		//如果是通过搜索内容获取
							trHtml += '<td class="memo_msglst_td_date" >'+task.date+'</td>'+
												 '<td class="memo_msglst_td_content">';
					}else{
							trHtml += '<td class="memo_msglst_td_date" >'+task.time+'</td>'+
												 '<td class="memo_msglst_td_content">';
					}

					if( 1 == task.is_done ){		//任务已经完成
							trHtml += '<span class="memo_msglst_digest memo_donetask_style">'+ subjectDigest +'</span>';
					}else{		//任务尚未完成
							trHtml += '<span class="memo_msglst_digest">'+subjectDigest +'</span>';
					}

					trHtml +='<span class="memo_ico_msgtype '+task.typeFlag+'"></span></td></tr>';
			}
			$tbody.append(trHtml);
	}//end func-loadTaskToMsglist
	
	/*[消息列表面板]
	  *追加"新建任务"到任务列表(单个)
	  */
	function appendTaskToMsgList(_task){
			var iIsReciver = (task.creator != task.reciver)? 1 : 0 ;
			var subjectDigest = truncateStr(_task.subject, 25, "...");

			var $tbody = $(".memo_msglst_container tbody", "#memo_out_container");

			var 	trHtml = '<tr data-task-no="'+_task.task_no+'" data-oth-reciver="'+_task.oth_reciver+
									  '" data-is-reciver="'+iIsReciver+'"><td class="memo_msglst_td_date" >'+_task.time+'</td>'+
									  '<td class="memo_msglst_td_content"><span class="memo_msglst_digest">'+subjectDigest+
									  '</span><span class="memo_ico_msgtype '+_task.typeFlag+'"></span'+
									  '></td></tr>';
			$tbody.append(trHtml);
	}//end func-appendTaskToMsgList

	//重新选择之前的消息
	function reSelectePreTask(){
			var $trSet = $(".memo_msglst_container tr", "#memo_out_container");
			if(0 == $trSet.length){	  
					setTimeout(reSelectePreTask, 200);
			}else{
					var len = $trSet.length;
					for(var i = 0; i < len; i++){
							var tr =  $trSet[i];
							if(tr.dataset.taskNo == g_preSelectedTaskNo){	
									var $tr = $(tr);
									$tr.click();
									$tr.parents(".memo_msglst_container").scrollTop($tr.position().top);
									break;
							}
					}//for
			}//else
	}//func
		
	/*[消息列表面板]
	  *卸载消息列表
	  */
	function clearMsgList(){
			$(".memo_msglst_container tbody", "#memo_out_container").empty();
	}//end func-clearMsgList
	
	/*[消息列表面板]
	  *获取被选中消息的编号
	  */
	 function getNoOfSelectedTask(){
			var $tr = $(".memo_msglst_container tr.memo_msg_selected", "#memo_out_container");
			return $tr[0].dataset.taskNo;
	 }//end func

	/*[消息列表面板]
	  *获取得到此消息的除创建者以外的某个其他接收者接受的名称
	  */
	 function getOthReciverOfSelectedTask(){
	 		var $tr = $(".memo_msglst_container tr.memo_msg_selected", "#memo_out_container");
			return $tr[0].dataset.othReciver;
	 }//end func

	/*[消息列表面板]
	  *获取登录者对于这条消息而言是否是接收者
	  */
	 function getIsReciverOfSelectedTask(){
	 		var $tr = $(".memo_msglst_container tr.memo_msg_selected", "#memo_out_container");
			return $tr[0].dataset.isReciver;
	 }//end func
	 
	/*[消息列表面板]
	  *获取选中的消息对应的taskList中的task对象
	  */
	 function getSelectedTaskObj(){
			var taskNo = getNoOfSelectedTask();
			var len = taskList.length;
			for(var i =0; i < len; i++){
					var task = taskList[i];

					if( task.task_no == taskNo){
							return task;
					}
					continue;
			}
	}//end func

	/*[消息列表面板]
	  *判断是否有消息(任务)被选中
	  *true 被选中，false 没有被选中
	  */
	 function existsTaskBeSelected(){
			var $tr = $(".memo_msglst_container tr.memo_msg_selected", "#memo_out_container");
			return 1 == $tr.length;
	 }//end func
	
	/*[编辑面板]
	  *设置操作集
	  */
	function loadOprtList(_taskObj){
			$(".memo_msgdtl_opts", "#memo_out_container").empty().append(_taskObj.optList);
	}//end func-

	/*[编辑面板]
	  *加载"新建事件"时的任务列表
	  *固定为[创建|取消]
	  */
	function loadCreatingOprtList(){
			var optsHtml = '<li><span id="memo_btn_msgcreate" class="memo_ico_msgcreate memo_ico_func" title="创建任务"></span></li>'+
											'<li><span id="memo_btn_msgcancel" class="memo_ico_msgcancel memo_ico_func" title="取消"></span></li>';
			$(".memo_msgdtl_opts", "#memo_out_container").empty().append(optsHtml);
	}//end func 
	
	/*[编辑面板]
	  *清空操作集
	  */
	function clearOprtList(){
			$(".memo_msgdtl_opts", "#memo_out_container").empty();
	}//end func-clearOprtList

	/*[编辑面板]
	  *检测是"用户对于"消息有"保存功能",影响到是否开始编辑框
	  */
	function hasSaveOperation(_taskObj){
			var cssClass = "memo_ico_msgsave";
			if( _taskObj.optList.indexOf(cssClass) > -1){		//有
					return true;
			}else{
					return false;
			}
	}//end func-hasSaveOperation
	
	/*[编辑面板]
	  *加载消息内容
	  */
	function loadMsgContent(_taskObj){
			var $subjboard = $(".memo_msgSubject_edit", "#memo_out_container");			//主题面板
			var $commboard = $(".memo_msgComment_edit", "#memo_out_container");		//备注面板
			
			$subjboard.text(_taskObj.subject);
			$commboard.text(_taskObj.comments);
	}//end func
	
	/*[日历面板]
	  *显示"新建按钮"
	  */
	function showBtnCreateTask(){
			$("#memo_cld_btn_createTask").removeClass("memo_btn_createtask_hide");
	}

	/*[日历面板]
	  *隐藏"新建按钮"
	  */
	function hideBtnCreateTask(){
			$("#memo_cld_btn_createTask").addClass("memo_btn_createtask_hide");
	}

	/*[日历面板]
	  *获取当前选中日历单元格所映射的 MemoCalendar实例中的m_curCalenarDatas[][]元素
	  */
	function getSelectedDate(_memoCld){
			$td = $("td.cld_td_selected", "#memo_the_cld");
			var colIndex = $td.index();
			var rowIndex = $td.parent().index();
			
			return _memoCld.m_curCalendarDatas[rowIndex][colIndex];
	}//end func
	
	/*[日历面板]
	  *获取选中的日历单元格jq对象
	  */
	function getSelectedCldUnit(){
			return $("td.cld_td_selected", "#memo_the_cld");
	}//end func

	/*[日历面板]
     *获取当日的日历单元格jq对象
	 */
	 function getTodayCldUnit(){
			return $(".memo_td_today", "#memo_the_cld");
	 }//end func

	/*[组面板]
	  *组成员面板是否处于打开状态
	  *打开则返回true 否则false
	  */
	function isGpListBoardOpened(){
			return !$(".memo_gpDashboard", "#memo_out_container").hasClass("memo_gplist_hide");
	}//end func
	
	/*[组面板]
	  *加载组成员列表
	  */
	function loadGpList(_gpList){
			var len = _gpList.length;
			var $gpListBoard = $(".memo_gpListContainer", "#memo_out_container");
			var listHtml = "";

			for(var i = 0; i < len; i++){
					var member = _gpList[i];
					listHtml += '<li><span class="memo_ico_useronline memo_ico_func" data-member="'+member.uname+'">'+
											member.uname+'</span></li>';
			}
			 $gpListBoard.empty().append(listHtml);
	}//end func

	/*[组面板]
	  *打开组成员面板
	  *每次打开后都是重新加载
	  */
	function openGpListBoard(){
			var $gpboard = $(".memo_gpDashboard");
			$gpboard.removeClass("memo_gplist_hide");		//显示组列表

			$(".memo_ico_msggplist", "#memo_out_container").parent()
				  .addClass("memo_btn_gplist_on");		//"展开组面板"按钮的父元素选中

	}//end func	

	/*[组面板]
	  *关闭组成员面板
	  */
	function closeGpListBoard(){
			var $gpboard = $(".memo_gpDashboard");
			$gpboard.addClass("memo_gplist_hide");				//显示组列表

			$(".memo_ico_msggplist", "#memo_out_container").parent()
				  .removeClass("memo_btn_gplist_on");		//"展开组面板"按钮的父元素取消选中

			disableSendBtn();		//禁用发送按钮
	}//end func

	/*[组面板]
	  *是否有组成员被选中
	  */
	function existsMemberBeSelected(){
			return $(".memo_gpListContainer li.memo_gplist_selected", "#memo_out_container").length > 0;
	}//end func

	/*[组面板]
	  *启用发送按钮
	 */
	function enableSendBtn(){
			$("#memo_btn_send").removeClass("memo_btn_send_off");
	}
	 
	 /*[组面板]
	   *禁用发送按钮
	   */
	 function disableSendBtn(){
			$("#memo_btn_send").addClass("memo_btn_send_off");
	  }

	  //全局
	  //按内容搜索
	  function reqSrhByContent(){
			$.get("response/rspSrhByContent.php",
					{
							"reciver" : admin, 
							"srhContent" : getSrhContent()
					},
					function(rspData, testStates){
						try{
								var rspRes = JSON.parse(rspData);
						}catch(e){
								alert("json parse failed in searching");
								return;
						}
								
						//请求失败
						if(0 == rspRes.isSuc){
								alert("没有查询到相关信息!");
								return;
						}

						//请求成功,加载
						taskList = rspRes.taskSet;
						turnBySearchFlagOn();					//打开搜索标志
						loadTaskToMsglist(taskList);
			    }//func
			);//get
	  }//end func-req
	
	//settings
	var TASKFLAG_REFRESH_CREATE = 1;				//由"任务创建"引发
	var TASKFLAG_REFRESH_DELETE = 2;				//由"任务删除"引发
	var TASKFLAG_REFRESH_DONE = 3;					//由"任务完成"引发
	var TASKFLAG_REFRESH_UNDONE = 4;			//由"撤销任务完成"引发

	var querySet = getQueryStringArgs();
	var admin = querySet.admin;

	var memoCld = new Memo_Calendar("-");
	var taskList =null;
	var g_preSelectedTaskNo = null;	 
	var g_creating = false;			//是否正在创建任务
	var g_bySearch = false;		//是否是靠搜索获取的任务[每次点击"日历单元格"时关闭,点击搜索按钮时"开启"]
	var hd_realRefreshCldTaskFlag = null;
	var hd_realRefreshTaskList = null;
	
	//运行实时刷新消息列表
	//用于在用户选中日期时，实时更新待完成的任务
	function runRealRefreshTaskList(){
		hd_realRefreshTaskList =
			setInterval(function(){
					var selectedUnit = getSelectedCldUnit();

					//有选中单元格 并且 无任务被选中 并且 没有新建任务时
					if( 1 == selectedUnit.length && !existsTaskBeSelected() 
							&& !checkCreatingFlag() ){

							//请求获取用户在当天的所有任务
							$.get("response/rspUnitDateTasks.php",
										{
											"reciver":admin,
											"dateStr":getSelectedDate(memoCld).toString()
										},
										function(rspData, textStates){
												try{
														var rspRes = JSON.parse(rspData);
												}catch(e){
														alert("json parse failed in selecting data");
														return;
												}
												taskList = rspRes.taskSet;

												turnBySearchFlagOff();					//关闭搜索标识
												loadTaskToMsglist(taskList);
										}//func
							);//end get
					}
			}, 6000);
	}//end func-runRealRefreshTaskList

	//运行实时刷日历面板
	//用于实时更新日历面板的任务标识
	function dynamicRefreshCldTaskFlag(_taskCompInfo){
			//加载日历单元格
			memoCld.attachTaskInfoToUnitDate(_taskCompInfo);			//添加任务完成属性
			for(var i = 0; i < memoCld.m_cldRows; i++){
					for(var j = 0; j < memoCld.m_cldCols; j++){
							var $tr = $("#memo_the_cld tbody tr:eq("+i+")");
							var $spanTaskFlag = $tr.find("td:eq("+j+") > span.memo_taskCompFlag");
							var cldDate = memoCld.m_curCalendarDatas[i][j];
							
							$spanTaskFlag.removeClass("memo_ico_tasktodo memo_ico_taskundo");
							if( 0 == cldDate.totalTaskNum ||		
									cldDate.totalTaskNum == cldDate.taskDoneNum ){			//如果没有任务/任务全部完成
									continue;
							}

							//如果有任务
							if(cldDate.toString() < memoCld.m_toDate.toString()){		//今日之前
									$spanTaskFlag.addClass("memo_ico_taskundo");
							}else{
									$spanTaskFlag.addClass("memo_ico_tasktodo");
							}
					}//end for
			}//end for

	}//end func-dynamicRefreshCldTaskFlag

	function runRealRefreshTaskFlag(){
			hd_realRefreshCldTaskFlag =
			setInterval(function(){
					var curDate = memoCld.m_curDate;
					$.get("response/rspTaskCompleteInfo.php",
						{
							"reciver":admin,
							"firstDate":memoCld.getFirstDateObj().toString(),
							"lastDate":memoCld.getLastDateObj().toString()
						}, 
						function(rspData, textState){
								try{
										var rspRes = JSON.parse(rspData);
								}catch(e){
										alert("json parse failed in opening main board!");
										return;
								}
								dynamicRefreshCldTaskFlag(rspRes.taskCompInfo);
						}//end callback
					);//end get

			}, 6000);
	}//end func-runReadRefreshCldBoard

	//点击时，开启备忘录
	$("#showMemo").click(function(){
			$("#memo_out_container").toggleClass("memo_board_hide");
			 disableEditboard();		//禁用编辑面板

			/*得到本月日历月的最后一天和第一天  发送请求
			  *请求指定时间段的任务完成信息  rspObj.taskCompInfo
			  *以及某时间之前是否有没有完成的任务标识  rspObj.undoneFlag
			  */
			$.get("response/rspTaskCompleteInfo.php",
						{
							"reciver":admin,
							"firstDate":memoCld.getFirstDateObj().toString(),
							"lastDate":memoCld.getLastDateObj().toString()
						}, 
						function(rspData, textState){
								try{
										var rspRes = JSON.parse(rspData);		
								}catch(e){
										alert("json parse failed in opening main board!");
										return;
								}
			
								refreshCalendarBoard(rspRes.undoneFlag, rspRes.taskCompInfo, memoCld);  //刷新日历面板
								getTodayCldUnit().click();								//选中当天
								
								//打开实时请求
								runRealRefreshTaskFlag();			//实时刷新日历面板(任务标识)
								runRealRefreshTaskList();			//实时刷新实任务列表
						}//end callback
			);//end get

	});//end click

	/*备忘录行为*/ 
	$(".memo_container").on("keyup", "#memo_txt_srh", function(e){
			//搜索输入框-回车，触发查询
			if(13 == e.which){
					$("#memo_btn_srh").click();
			}

	}).on("click", "#memo_btn_srh", function(){
			//搜索按钮		//alert("memo_btn_srh");
			var cldUnit = getSelectedCldUnit();
			if(cldUnit.length > 0){		//如果存在单元格被选中
					cldUnit.click();			//取消选中
			}

			$.get("response/rspSrhByContent.php",
					   {
								"reciver" : admin, 
								"srhContent" : getSrhContent()
						},
						function(rspData, testStates){
								try{
										var rspRes = JSON.parse(rspData);
								}catch(e){
										alert("json parse failed in searching");
										return;
								}
								
								//请求失败
								if(0 == rspRes.isSuc){
										alert("没有查询到相关信息!");
										return;
								}

								//请求成功,加载
								taskList = rspRes.taskSet;
								turnBySearchFlagOn();					//打开搜索标志
								loadTaskToMsglist(taskList);
					    }//func
			);//get
	}).on("click", "#memo_btn_close", function(){
			//关闭按钮	//alert("memo_btn_close");
			$("#memo_out_container").addClass("memo_board_hide");	
			
			//关闭实时请求
			clearInterval(hd_realRefreshCldTaskFlag);
			clearInterval(hd_realRefreshTaskList);
			
			//还原到今日时间
			memoCld.restoreDate();
			memoCld.buildCalendarData_cn();
			var cldGrid = memoCld.buildCalendarGrid_cn("NUM");
			var dateStr = getDateToShow(memoCld);

			$("#memo_the_cld").html(cldGrid);						//填充日历
			$("#memo_span_curDate").html(dateStr);		//显示年月

	}).on("click", "#memo_btn_lastyr", function(){
			//上一年按钮		
			//alert("memo_btn_lastyr");
			memoCld.minusYear();			//日历年份减去1
			memoCld.buildCalendarData_cn();
			
			/*得到本月日历月的最后一天和第一天  发送请求
		 	  *请求指定时间段的任务完成信息 rspRes.taskCompInfo
			  *以及某时间之前是否有没有完成的任务标识 rspRes.undoneFlag
			  */
			$.get("response/rspTaskCompleteInfo.php",
						{
							"reciver":admin,
							"firstDate":memoCld.getFirstDateObj().toString(),
							"lastDate":memoCld.getLastDateObj().toString()
						}, 
						function(rspData, textState){
								try{
										var rspRes = JSON.parse(rspData);
								}catch(e){
										alert("json parse failed in showing last year calendar!");
										return;
								}
								
								refreshCalendarBoard(rspRes.undoneFlag, rspRes.taskCompInfo, memoCld);  //刷新日历面板
							}//func
				);//get
	}).on("click", "#memo_btn_lastmth", function(){
			//上个月按钮		//alert("memo_btn_lastmth");
			memoCld.minusMonth();											//日历月份减去1
			memoCld.buildCalendarData_cn();						//构造日历单元格数据
	
			/*得到本月日历月的最后一天和第一天  发送请求
		 	  *请求指定时间段的任务完成信息 rspRes.taskCompInfo
			  *以及某时间之前是否有没有完成的任务标识 rspRes.undoneFlag
			  */
			$.get("response/rspTaskCompleteInfo.php",
						{
							"reciver":admin,
							"firstDate":memoCld.getFirstDateObj().toString(),
							"lastDate":memoCld.getLastDateObj().toString()
						}, 
						function(rspData, textState){
								try{
										var rspRes = JSON.parse(rspData);
								}catch(e){
										alert("json parse failed in showing last month calendar!");
										return;
								}
								
								refreshCalendarBoard(rspRes.undoneFlag, rspRes.taskCompInfo, memoCld);  //刷新日历面板
							}//func
				);//get
	}).on("click", "#memo_span_curDate", function(){
			//当前月份  alert("memo_span_curDate")
			memoCld.restoreDate();
			memoCld.buildCalendarData_cn();						//构造日历单元格数据

			/*得到本月日历月的最后一天和第一天  发送请求
		 	  *请求指定时间段的任务完成信息 rspRes.taskCompInfo
			  *以及某时间之前是否有没有完成的任务标识 rspRes.undoneFlag
			  */
			$.get("response/rspTaskCompleteInfo.php",
						{
							"reciver":admin,
							"firstDate":memoCld.getFirstDateObj().toString(),
							"lastDate":memoCld.getLastDateObj().toString()
						}, 
						function(rspData, textState){
								try{
										var rspRes = JSON.parse(rspData);
								}catch(e){
										alert("json parse failed in showing last month calendar!");
										return;
								}
								
								refreshCalendarBoard(rspRes.undoneFlag, rspRes.taskCompInfo,memoCld);  //刷新日历面板
								getTodayCldUnit().click();								//选中当天
							}//func
				);//get

	}).on("click", "#memo_btn_nextmth", function(){
			//下个月按钮	//alert("memo_btn_nextmth");
			memoCld.addMonth();								//日历月份添加1
			memoCld.buildCalendarData_cn();

			/*得到本月日历月的最后一天和第一天  发送请求
		 	  *请求指定时间段的任务完成信息 rspRes.taskCompInfo
			  *以及某时间之前是否有没有完成的任务标识 rspRes.undoneFlag
			  */
			$.get("response/rspTaskCompleteInfo.php",
						{
							"reciver":admin,
							"firstDate":memoCld.getFirstDateObj().toString(),
							"lastDate":memoCld.getLastDateObj().toString()
						}, 
						function(rspData, textState){
								try{
										var rspRes = JSON.parse(rspData);
								}catch(e){
										alert("json parse failed in showing next month calendar!");
										return;
								}
								
								refreshCalendarBoard(rspRes.undoneFlag, rspRes.taskCompInfo,memoCld);  //刷新日历面板
							}//func
				);//get
	}).on("click", "#memo_btn_nextyr", function(){
			//下一年按钮
			memoCld.addYear();
			memoCld.buildCalendarData_cn();

			/*得到本月日历月的最后一天和第一天  发送请求
		 	  *请求指定时间段的任务完成信息 rspRes.taskCompInfo
			  *以及某时间之前是否有没有完成的任务标识 rspRes.undoneFlag
			  */
			$.get("response/rspTaskCompleteInfo.php",
						{
							"reciver":admin,
							"firstDate":memoCld.getFirstDateObj().toString(),
							"lastDate":memoCld.getLastDateObj().toString()
						}, 
						function(rspData, textState){
								try{
										var rspRes = JSON.parse(rspData);
								}catch(e){
										alert("json parse failed in showing next year calendar!");
										return;
								}
								
								refreshCalendarBoard(rspRes.undoneFlag, rspRes.taskCompInfo,memoCld);  //刷新日历面板
							}//func
				);//get
	}).on("click", "#memo_cld_btn_createTask", function(){
			//新建事件
			if( checkCreatingFlag() ){ return;	}		//如果正在创建
			
			//如果有消息被选中,取消选中
			if($(".memo_msglst_container tr.memo_msg_selected", "#memo_out_container").length == 1){	
					$(".memo_msglst_container tr.memo_msg_selected", "#memo_out_container").click();
			}

			$(".memo_msgSubject_edit", "#memo_out_container").empty().removeClass("memo_subjboard_disable")
																														.prop("contenteditable", true);			//启用主题面板
			$(".memo_msgComment_edit", "#memo_out_container").empty().removeClass("memo_commboard_disable")
																														     .prop("contenteditable", true);		//启用备注面板
			loadCreatingOprtList();			//添加操作集
			turnCreatingFlagOn();			//标识"正在创建"

	}).on("click", "#memo_btn_msgcreate", function(){
			//消息(任务)创建
			if(isSubjectEmpty()){			//检测主题是否为空		
					alert("请填写任务主题!"); 
					return;
			}
			
			var selectedDate = getSelectedDate(memoCld);			//选中日期
			var subject = $(".memo_msgSubject_edit", "#memo_out_container").text().trim();				//获得主题
			var comments = $(".memo_msgComment_edit", "#memo_out_container").text().trim();	//获得备注

			//发送创建请求
			$.get("response/rspCreateTask.php",
						{
								"selectedDateStr":selectedDate.toString(),
								"creator":admin,
								"subject":subject,
								"comments":comments
						},
						function(rspData, textStates){
								try{
										var rspRes= JSON.parse(rspData);
								}catch(e){
										alert("json parse filed in creating task!");
										return;
								}

								if(0 == rspRes.isSuc){			//创建成功
										alert("系统繁忙，请稍后再试!");
										return;
								}

								//事件创建成功
								refreshTaskFlag(memoCld, TASKFLAG_REFRESH_CREATE);	//刷新单元格'任务标识'
								disableEditboard();		//禁用消息编辑面板;
								clearOprtList();				//清除消息列表
								turnCreatingFlagOff();			//复位"消息创建标识"
																
								var cldUnit = getSelectedCldUnit();		
								cldUnit.click().click();			//重刷"日期"单元格

								alert("任务创建成功!");
						}//func
			);//get

	}).on("click", "#memo_btn_msgcancel", function(){
			//取消消息创建
			disableEditboard();			//禁用各种面板
			clearOprtList();					//清除操作集
			turnCreatingFlagOff();	//复位"正在创建"标识

	}).on("click", "#memo_btn_msgsave", function(){
			//消息(更新)保存			//alert("memo_btn_msgsave");
			var taskObj = getSelectedTaskObj();
			
			if( !updatedVerify(taskObj) ){		//更新未通过
					alert("请先做出修改!");
					return;
			}

			//更新验证通过
			$.get("response/rspUpdateTask.php",
						{
								"taskNo" : getNoOfSelectedTask(),
								"subject" : getSubject(),
								"comments" : getComments(),
								"iIsReciver" : getIsReciverOfSelectedTask()
						},
						function(rspData, textState){
								try{
										var rspRes= JSON.parse(rspData);
								}catch(e){
										alert("json parse filed in updating task!");
										return;
								}
								
								if( 0 == rspRes.isSuc && 2 == rspRes.conflictNo ){
										alert("创建者已经将任务删除或收回!");
										getSelectedCldUnit().click().click();
										return;
								}else if(0 == rspRes.isSuc && 0 == rspRes.conflictNo ){			//更新失败
										alert("系统繁忙，请稍后再试!");
										return;
								}

								//更新成功
								if(true == checkBySearchFlag()){		//如果是通过搜索获取的列表
										clearMsgList();						//清空列表，等待轮询
										reqSrhByContent();				//则重新获取一次
								}else{
										getSelectedCldUnit().click().click();		//更新单元格对应的日历表
								}

								alert("任务更新成功!");
								reSelectePreTask();		//重新选择原来的消息
						}//func
			);//get

	}).on("click", "#memo_btn_msgdone", function(){
			//标记消息(任务)完成
			$.get("response/rspTaskDone.php",
					  {
							"solver" :  admin,
							"taskNo" : getNoOfSelectedTask(),
							"iIsReciver" : getIsReciverOfSelectedTask()
					  },
					   function(rspData, textState){
								try{
										var rspRes= JSON.parse(rspData);
								}catch(e){
										alert("json parse filed in being done task!");
										return;
								}
								
								if( 0 == rspRes.isSuc && 2 == rspRes.conflictNo){
										alert("创建者已经删除或者收回!");
										getSelectedCldUnit().click().click();
										return;
								}else if(0 == rspRes.isSuc && 0 == rspRes.conflictNo ){			//标记完成 失败
										alert("系统繁忙，请稍后再试!");
										return;
								}
								//标记完成 成功
								if(true == checkBySearchFlag()){		//如果是通过搜索获取的列表
										clearMsgList();						//清空列表，等待轮询
										reqSrhByContent() ;						//则重新获取一次
								}else{
										refreshTaskFlag(memoCld, TASKFLAG_REFRESH_DONE);			//刷新日历单元格任务标识
										getSelectedCldUnit().click().click();		//更新单元格对应的日历表
								}

								alert("任务已经完成!");	
								reSelectePreTask();		//重新选择原来的消息
				 	  }//func
			);//get

	}).on("click", "#memo_btn_msgundone", function(){
			//撤销消息完成		alert("memo_btn_msgundone");
			$.get("response/rspTaskUndone.php",
					  {
							"taskNo" : getNoOfSelectedTask(),
							"iIsReciver" : getIsReciverOfSelectedTask()
					  },
					   function(rspData, textState){
								try{
										var rspRes= JSON.parse(rspData);
								}catch(e){
										alert("json parse filed in being undone task!");
										return;
								}

								if( 0 == rspRes.isSuc && 2 == rspRes.conflictNo){
										alert("创建者已经删除任务!");
										getSelectedCldUnit().click().click();
										return;
								}else if(0 == rspRes.isSuc && 0 ==rspRes.conflictNo){			//标记完成 失败
										alert("系统繁忙，请稍后再试!");
										return;
								}
								//标记完成 成功
								if(true == checkBySearchFlag()){		//如果是通过搜索获取的列表
										clearMsgList();						//清空列表，等待轮询
										reqSrhByContent() ;						//则重新获取一次
								}else{
										refreshTaskFlag(memoCld, TASKFLAG_REFRESH_DONE);			//刷新日历单元格任务标识
										getSelectedCldUnit().click().click();		//更新单元格对应的日历表
								}

								alert("任务已恢复[未完成]状态!");
								reSelectePreTask();		//重新选择原来的消息
				 	  }//func
			);//get
		
	}).on("click", "#memo_btn_msggplist", function(){
			//显示组列表
			if(isGpListBoardOpened()){		//如果组成员面板已经打开
					closeGpListBoard();	//关闭面板
					return;
			}
			
			$.get("response/rspAdminList.php", { "admin": admin },
					 function(rspData, textState){
						    	try{
										var rspRes= JSON.parse(rspData);
								}catch(e){
										alert("json parse failed in showing grouplist!");
										return;
								}

								if(0 == rspRes.isSuc){			//请求失败
										alert("系统繁忙，请稍后再试!");
										return;
								}

							//请求成功，加载，打开面板
							var gpList = rspRes.adminList;
							loadGpList(gpList);					//加载组成员
							openGpListBoard();				//打开组面板
					}//func
			);//get
		
	}).on("click", "#memo_btn_msgback", function(){
			//收回已发送消息
			$.get("response/rspUndispatchTask.php", 
						{
							"taskNo" : getNoOfSelectedTask(),
							"othReciver" : getOthReciverOfSelectedTask()
						},
						function(rspData, textState){
						    	try{
										var rspRes= JSON.parse(rspData);
								}catch(e){
										//alert(rspData);
										alert("json parse failed in undispatch task!");
										return;
								}
								
								if( 0 == rspRes.isSuc && 1 == rspRes.conflictNo){
										alert("接受者已经完成任务!任务收回失败");
										getSelectedCldUnit().click().click();
										return;
								}else if(0 == rspRes.isSuc && 0 == rspRes.conflictNo){			//撤回失败
										alert("系统繁忙，请稍后再试!");
										return;
								}

								//请求成功，重载(单元格)消息列表
								if(true == checkBySearchFlag()){		//如果是通过搜索获取的列表
										clearMsgList();						//清空列表，等待轮询
										reqSrhByContent() ;						//则重新获取一次
								}else{
										getSelectedCldUnit().click().click();		//更新单元格对应的日历表
								}

								alert("任务已经收回!");
								reSelectePreTask();		//重新选择原来的消息
						}//func
			);//get
	
	}).on("click", "#memo_btn_msgdelete", function(){
			//消息删除
			$.get("response/rspDeleteTask.php",
					  { 
							"taskNo": getNoOfSelectedTask() 
						},
				      function(rspData, textState){ 
								try{
										var rspRes= JSON.parse(rspData);
								}catch(e){
										alert("json parse failed in deleting task!");
										return;
								}

								if(0 == rspRes.isSuc){			//请求失败
										alert("系统繁忙，请稍后再试!");
										return;
								}

								//请求成功
								var $cldUnit = getSelectedCldUnit();

								$cldUnit.click().click();				//刷新消息列表
								
								//刷新日历单元格"任务标识"
								refreshTaskFlag(memoCld, TASKFLAG_REFRESH_DELETE);		
								alert("任务删除成功!");
					  }//func
			);//get

	}).on("click", ".memo_gpListContainer li", function(){
			//选择接收人(接收人)，互斥
			var $li = $(this);
			var $span = $(this).children("span");
			$li.siblings(".memo_gplist_selected").removeClass("memo_gplist_selected");

			if($li.hasClass("memo_gplist_selected")){				//如果之前被选中
					$li.removeClass("memo_gplist_selected");		//取消选中
					disableSendBtn();			//禁用发送按钮

			}else{
					$li.addClass("memo_gplist_selected");				//选中某成员
					enableSendBtn();				//启用发送按钮
			}

	}).on("click", "#memo_btn_send", function(){
			//消息发送
			if(!existsMemberBeSelected()){
					alert("请先选中发送对象");
					return;
			}

			var reciver = $(".memo_gpListContainer li.memo_gplist_selected span", "#memo_out_container")[0].dataset.member;
			$.get("response/rspDispatchTask.php", 
						{	"reciver" : reciver, 
							"taskNo" : getNoOfSelectedTask(),
						},
						function(rspData, textStates){
								try{
										var rspRes = JSON.parse(rspData);
								}catch(e){
										alert("json parse failed in dispatching task");
								}

								if(!rspRes.isSuc){		//消息派遣失败
										alert("消息发送失败");
										return;
								}

								//消息发送成功

								if(true == checkBySearchFlag()){		//如果是通过搜索获取的列表
										clearMsgList();						//清空列表，等待轮询
										reqSrhByContent() ;						//则重新获取一次
								}else{
										getSelectedCldUnit().click().click();		//更新单元格对应的日历表
								}

								alert("消息发送成功");
								reSelectePreTask();		//重新选择原来的消息
						}//func
			);//get
			
	}).on("click", ".memo_msglst_container tr", function(){
			//点击消息项
			var $tr = $(this);
			var trIndex =$(this).index();
			var task = taskList[trIndex];		//获取对应的任务/消息对象

			closeGpListBoard();						//关闭组成员面板
			
			//1.判断消息是否选中状态
			if($tr.hasClass("memo_msg_selected")){
					disableEditboard();		//禁用消息编辑框
					clearOprtList();				//清空消息操作集
					$tr.removeClass("memo_msg_selected");		//取消选中状态
					g_preSelectedTaskNo = null;
					return;
			}
			
			//清除兄弟行的选中，并添加选中状态
			$tr.siblings(".memo_msg_selected").removeClass("memo_msg_selected")
																				   .end().addClass("memo_msg_selected");
			g_preSelectedTaskNo = getNoOfSelectedTask();			//记录当前选中的消息

			//2.如果不是接收者
			if(task.creator == task.reciver){	
					enableEditboard(task);			//启用消息编辑框
					loadMsgContent(task);			//加载消息内容
					loadOprtList(task);					//加载操作集
					return;
			}//if
		
			//3.如果是接收者，并且已经打开过消息
			if(1 == task.reciver_read){
					enableEditboard(task);			//启用消息编辑框
					loadMsgContent(task);			//加载消息内容
					loadOprtList(task);					//加载操作集
					return;
			}
			//否则,发送请求"打开消息"
			$.get("response/rspOpenTask.php",
					   {
							"taskNo":task.task_no,
							"reciver":admin
						},
						function(rspData, textState){
								try{
										var rspRes = JSON.parse(rspData);
								}catch(e){
										alert("json parse failed in reading task");
										return;
								}

								if(0 == rspRes.isSuc){		//如果打开失败
										alert("系统繁忙，请稍后再试!");
										return;
								}

								//如果打开成功
								task.reciver_read = 1;
								$tr.find(".memo_ico_msgtype").removeClass("memo_ico_rcvunread")
																				               .addClass("memo_ico_rcvhasread");
								enableEditboard(task);			//启用消息编辑框
								loadMsgContent(task);			//加载消息内容
								loadOprtList(task);					//加载操作集
						}//callback 
			);//get
				
	}).on("click", "#memo_the_cld td", function(){
			//选中日期
			$td = $(this);
			turnCreatingFlagOff();	//复位正在创建标识
			closeGpListBoard();		//关闭组成员面板
			
			//如果是选中的,则取消选中
			if($td.hasClass("cld_td_selected")){
					$td.removeClass("cld_td_selected");
					clearMsgList();			  //卸载消息面板
					disableEditboard();		  //禁用编辑面板
					clearOprtList();				  //清空操作集
					hideBtnCreateTask();	  //隐藏新建按钮
					return;
			}

			//否则,禁用编辑栏|清空操作项,添加选中标识
			disableEditboard();			//禁用操作项
			clearOprtList();					//清空操作集
			clearSearhContent();		//清除上次查询内容

			$(".cld_td_selected", "#memo_the_cld").removeClass("cld_td_selected");		//添加选中标识
			$td.addClass("cld_td_selected");
			
			//获取选中单元格对应的cldDate对象
			var selectedCldDate = getSelectedDate(memoCld);
			if( !isDateBeforeToday(selectedCldDate, memoCld) ){
					showBtnCreateTask();	//显示新建按钮
			}else{
					hideBtnCreateTask();		//隐藏新建按钮
			}

			if(0 == selectedCldDate.totalTaskNum){		//如果从没设置任务，不用请求
					$(".memo_msglst_container tbody", "#memo_out_container").empty();
					return;
			}
			
			//请求获取用户在当天的所有任务
			$.get("response/rspUnitDateTasks.php",
						{
							"reciver":admin,
							"dateStr":selectedCldDate.toString()
						},
						function(rspData, textStates){
								try{
										var rspRes = JSON.parse(rspData);
								}catch(e){
										alert("json parse failed in selecting data");
										return;
								}
								taskList = rspRes.taskSet;
								taskCompInfo = rspRes.taskCompInfo;

								turnBySearchFlagOff();					//关闭搜索标识
								loadTaskToMsglist(taskList);
						}//func
			);//end get
	});//end click

})//end ready