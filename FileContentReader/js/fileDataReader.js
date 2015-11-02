/**
*@auther lucifer-v.
*@createDate 2015/01/13
*@lastModified 2015/10/04
*
*
*
**/
function fileDataReader(_target, _fHandleUrl, _fReadUrl, _options, _callback){
		var fdr = this;				//固化this
				
		fdr.$btn = $(_target);													//保存fdr按钮, $表示是jq对象
		fdr.name = fdr.$btn.attr("id").split('_')[1];		//获得控件名称
		fdr.limit = fdr.$btn.attr("data-limit");					//获得控件的允许上传的最大文件大小
		fdr.allowedExt = fdr.$btn.attr("data-ext");			//获取空间允许上传的文件后缀,此处要和_fHandleUrl脚本指定的
																									//允许上传文件后缀名一致
		fdr.extSet = fdr.allowedExt.split(',');						//得到后缀名集合，便于处理
		fdr.fileId = null;
				
		//default options
		fdr.disabledCss =  fdr.$btn.attr("data-disabled");			//上传正在进行时，
		fdr.intervalTime = 800;																//轮询间隔
		fdr.reqTimes = 3;																			//轮询次数
		fdr.upfileName = "fdrFile";														//input[type=file]的name

		//set customized options
		if( undefined != _options ){				//如果传递了选项参数，则覆盖默认选项
				for(prop in _options){		
						fdr[prop] = _options[prop];
				}
		}//if

		//initiate wrap the <a> btn, 对<a>进行包装操作
		(function(){
				var wrapHtml = 
						'<div style="position:relative;display:inline-block;padding:0;margin:0;"></div>';
				var contentHtml = 
						'<iframe id="ifr_'+fdr.name+'" name="ifr_'+fdr.name+'" style="border:0; width:0;'+
						'height:0;position:absolute;top:0;left:0;z-index=-100;"></iframe>'+
						'<form action="'+_fHandleUrl+'" method="post" enctype="multipart/form-data" target="ifr_'+fdr.name+'">'+
						'<input type="hidden" name="MAX_FILE_SIZE" value="'+fdr.limit+'"/>'+
						'<input type="hidden" name="allowedExt" value="'+fdr.allowedExt+'"/>'+
						'<input type="hidden" name="fileId" value="">'+
						'<input type="file" name="'+fdr.upfileName+'" style="position:absolute; border:0;width:0;height:0;z-index=-100;"/>'+
						'</form>';

				fdr.$btn.wrap(wrapHtml);
				fdr.$btn.parent().append(contentHtml);
		})();//initiate 
				
		//get inner controller
		fdr.$form = $btn.next().next();																//获取<a>对应的表单jq对象
		fdr.$hiddenFileId = fdr.$form.children(":nth-child(3)");				//获取表单中name为fileId的hidden控件,用于唯一标识文件
																																	//php脚本将此作为文件的名字，控件用此文件名轮询
		fdr.$inputFile = fdr.$hiddenFileId.next();											//获得input[name=file]控件
				
		//disableBtn
		fdr.disableBtn = function(){
				fdr.$btn.addClass(fdr.disabledCss);
		};
				
		//enableBtn
		fdr.enableBtn = function(){
				fdr.$btn.removeClass(fdr.disabledCss);
		};
				
		//extNameCheck
		fdr.extNameCheck = function(){
				fdr.curExt = fdr.$inputFile.val().split(".")[1];						//获取当前上传文件扩展名
				return (fdr.extSet.indexOf( fdr.curExt ) >= 0)? true: false;		//如果文件类型被允许，则返回true，否则false
		}//func

		//<a> btn 
		fdr.$btn.click(function(){
				if( $btn.hasClass(fdr.disabledCss) ){		//if btn is disabled, 按钮点击事件，如果处于禁用状态，点击无效
								return;
				}

				fdr.fileId = (new Date()).getTime() + "_" + getRandom(8);				//生成fileId
				fdr.$inputFile.click();																						//触发文件选择控件
		});//click

		//inputFile change
		fdr.$inputFile.change(function(){
				var $this = $(this);
				if( "" == $this.val() ){	return;	}

				//check extension
				//如果扩展名不符合要求，则弹出提示
				if( !fdr.extNameCheck() ){
						alert("请上传扩展名为: " + extSet.join(", ") + " 的文件");
						return;
				}

				//handle data and submit file
				fdr.$hiddenFileId.val(fdr.fileId);					//设置文件id
				fdr.$form.submit();												//提交表单

				//request get file content
				//ajax轮询
				fdr.disableBtn();								//禁用按钮
				var reqTimes = fdr.reqTimes;		//轮询次数
				function reqFileContents(){
						var reqUrl = _fReadUrl + '?fileName='+fdr.fileId+"."+fdr.curExt;		//请求
						
						$.post(reqUrl, function(rspResult, sucState){

								var rspObj = JSON.parse( rspResult );		//响应对象
								
								if( 0 == rspObj.state){		//成功

										//调用回调函数处理
										_callback( rspObj.data );
										//启用按钮
										fdr.enableBtn();
								}else{

										if( --reqTimes > 0){
												setTimeout(reqFileContents, fdr.intervalTime);
										}else{
												fdr.enableBtn();
												alert( rspObj.errMsg );
										}
								}//else
						});//post
				}//func-reqFileContents
				setTimeout(reqFileContents, fdr.intervalTime);
		});//change
}//func