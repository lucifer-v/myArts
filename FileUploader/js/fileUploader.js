/** 文件上传控件 **/
function FileUploader($_form, _option, _para){
			/*简化变量*/
			var upf = this;
			var opt = _option;
			var pa = _para;
		
			/*初始化结构*/
			(function initStruct(){
					var html='<div class="upf_imgWrap upf_imgWrapHide">'+
										'	<img class="upf_img" src="images/pic1.jpg"/>'+
										'	<span class="upf_delIco upf_delIcoHide"></span>'+
										'</div>'+
										'<div class="upf_imgCover">'+
										'	<span class="upf_uploadingGif  upf_gifHide"></span>'+
										'	<span class="upf_delingGif upf_gifHide"></span>'+
										'</div>'+
										'<input type="file" name="uploadedFile" style="width:0;height:0;" class="upf_fileChoose"/>'+
										'<input type="hidden" name="fileInfo" />';
					$_form.append(html);
			})();//end func-initStruct
			
			/*结构变量*/
			upf.$form=$_form;
			upf.$imgWrap=upf.$form.children(".upf_imgWrap");
			upf.$img=upf.$imgWrap.children(":first");
			upf.$delIco=upf.$img.next();
			upf.$imgCover=upf.$form.children(".upf_imgCover");
			upf.$uploadingSpan=upf.$imgCover.children(":first");
			upf.$delingSpan=upf.$uploadingSpan.next();
			upf.$fileChoose=upf.$form.children(".upf_fileChoose");
			upf.$hidden=upf.$form.children(":last");

			/*初始化控制变量*/
			upf.xmlhttp=null;													//Ajax对象
			upf.hasPrevPic=pa.hasPrevPic;						//downloadMode下要加载的图片的信息
			upf.uploadedSuc=false;										//是否上传成功
			upf.curReqTimes=0;											//当前请求次数
			upf.oldExtName=pa.prevPicExtName;		//老的文件扩展名
			upf.extName="";													//文件扩展名
			upf.fileInfo="";														//需要提交到后台脚本的文件信息
			
			/*初始化属性--start*/
			(function initStructAttr(){
					//form
					upf.$form.css({width:opt.imgWd+"px", height:opt.imgHt+"px", padding:opt.formPadding+"px"})
						  .attr({method:"post", "class":"upf_uploadForm", action: opt.upfHandler, enctype:"multipart/form-data"});
					//ifrm
					upf.$form.children(":first").css("display", "none");
					//imgWrap
					upf.$imgWrap.css({position:"relative", border:opt.border+"px solid "+opt.borderColor, 
						width:opt.imgWd+"px", height:opt.imgHt+"px"});
			
					//img
					upf.$img.css({width:opt.imgWd+"px", height:opt.imgHt+"px"});
					//delIco
					upf.$delIco.css({width:opt.delIcoWd+"px", height:opt.delIcoHt+"px", position:"absolute",		 
						backgroundImage:"url("+opt.delIcoPath+")", backgroundPosition:opt.delIcoPosi, top:opt.delIcoTop+"px",
						right:opt.delIcoRight+"px"});
					//imgCover
					upf.$imgCover.css({border:opt.border+"px solid "+opt.borderColor, width:opt.imgWd, height:opt.imgHt,
						cursor:"pointer", backgroundImage:"url("+opt.addIcoPath+")", backgroundRepeat:"no-repeat",
						position:"relative"});
					//uploadingGif
					var uploadingTop=Math.floor((opt.imgHt-opt.uploadingGifHt)/2);
					var uploadingLeft=Math.floor((opt.imgWd-opt.uploadingGifWd)/2);
					upf.$uploadingSpan.css({position:"absolute", width:opt.uploadingGifWd+"px", height:opt.uploadingGifHt+"px",
						top:uploadingTop+"px", left:uploadingLeft+"px", backgroundImage:"url("+opt.uploadingGifPath+")",
						backgroundRepeat:"no-repeat"});
					//delingGif
					var delingTop=Math.floor((opt.imgHt-opt.delingGifHt)/2);
					var delingLeft=Math.floor((opt.imgWd-opt.delingGifWd)/2);
					upf.$delingSpan.css({position:"absolute", width:opt.delingGifWd+"px", height:opt.delingGifHt+"px",
						top:delingTop+"px", left:delingLeft+"px", backgroundImage:"url("+opt.delingGifPath+")",
						backgroundRepeat:"no-repeat"});
			})();//end func-initStructAttr
			/*初始化属性--end*/

			/*事件注册--start*/
			//imgWrap鼠标划过事件
			upf.$imgWrap.mouseover(function(){
					upf.$delIco.removeClass("upf_delIcoHide");
			}).mouseout(function(){
					upf.$delIco.addClass("upf_delIcoHide");
			});
			//imgCover点击事件
			upf.$imgCover.click(function(){
					upf.$fileChoose.click();
			});
			//delIco点击事件
			upf.$delIco.click(function(){
					deleteProcess();
					setTimeout(function(){
							var url=opt.fileDeleteHandler+"?fileInfo="+upf.fileInfo;
							sendAjaxGetReq(upf.xmlhttp, url, reqDeleteFileHandler);
					}, opt.reqIntervalTime);
			});
			//input-file change事件
			upf.$form.on("change", ".upf_fileChoose", function(){
					var val=upf.$fileChoose.val();
					
					if( "" != val){
							//扩展名检查
							var extTmp=val.split(".")[1];
							if( !isExtNameValid(extTmp) ){
									alert("请上传扩展名为:"+pa.extAllow+" 的文件");
									return;
							}

							//重新组织数据，只有上传时，才用得到para中的数据
							upf.fileInfo="";
							for(attr in pa){
									if(attr.indexOf("info_") > -1){
											upf.fileInfo+=pa[attr]+pa.separator;
									}
							}//end for

							upf.extName = extTmp;			//存储扩展名
							upf.fileInfo += upf.extName;	//存储上传信息
							upf.$hidden.val(upf.fileInfo);			//携带上传信息
							uploadProcess();									//上传过程
							upf.$form.submit();							//提交表单
							
							setTimeout( toCheckFileExists, opt.reqIntervalTime );		//延迟发送，检测是否上传成功
					}//end if
			});//end func-change
			/*事件注册--end*/

			//检测是否是uploadedMode(已上传模式)
			(function isUploadedMode(){

					if( pa.hasPrevPic ){
							upf.fileInfo = pa.prevPicInfo;		//组织信息
							
							//发送移动文件的请求
							if( "" != pa.movePicHandler ){
									$.post( pa.movePicHandler, { fileInfo : upf.fileInfo }, null );
							}

							uploadProcess();								//模拟上传过程
							setTimeout(toCheckFileExists, opt.reqIntervalTime);		//请求已经存在的文件
							
					}//end if
			}());//end funcDef

			/*辅助函数--start*/
			//检测待上传文件的扩展名是否合法
			function isExtNameValid(_extName){
					var valid=false;
					var len=pa.extAllow.length;
					for(var i=0; i<len; i++){
							if(_extName==pa.extAllow[i]){
									valid=true;
									break;
							}
					}//for
					return valid;
			}//end funcDef-isExtNameValid

			//检测文件是否存在(为轮询封装)
			//如果存在则请求之
			function toCheckFileExists(){
					var url=opt.fileExistChkHandler+"?fileInfo="+upf.fileInfo;
					sendAjaxGetReq(upf.xmlhttp, url, reqIsFileExistsHandler, ++upf.curReqTimes);
			}

			//外部接口,获取upf对象的状态
			upf.getUpfState=function(){
					if( (upf.hasPrevPic==true && upf.uploadedSuc==true && upf.extName=="") || 
							(upf.hasPrevPic==false && upf.uploadedSuc==false)){
							return "STATE_HOLD";
					}
					if( upf.hasPrevPic==false && upf.uploadedSuc==true ){
							return "STATE_ADD";
					}
					if( upf.hasPrevPic==true && upf.uploadedSuc==false){
							return "STATE_DEL";
					}
					if( upf.hasPrevPic==true && upf.uploadedSuc==true && upf.extName!=""){
							return "STATE_REWRITE";
					}
			}//end func

			//为了兼容Mobile
			upf.refreshFileChoose = function(){
					upf.$fileChoose.replaceWith('<input type="file" name="uploadedFile" style="width:0;height:0;" class="upf_fileChoose"/>');			//替换原来的
					upf.$fileChoose=upf.$form.children(".upf_fileChoose");
			}//func-refreshFileChoose
			/*辅助函数--end*/

			/*ajax请求处理函数--star*/
			//请求检测文件是否存在
			function reqIsFileExistsHandler(_xmlhttp, _curReqTimes){
					if(_xmlhttp.readyState==4 && _xmlhttp.status==200){
							var rspText=_xmlhttp.responseText;
							if(""!=rspText){
									var random=Math.floor(10000*Math.random());
									upf.$img.attr("src", rspText+"?"+random);		//设置图片
									uploadSuc();		//上传成功
							}else{
									if(_curReqTimes>opt.reqTimesAllow){
											uploadFailed();			//上传失败
									}else{
											setTimeout(toCheckFileExists, opt.reqIntervalTime);		//轮询
									}
							}//end if
					}//end if
			}//end funcDef

			//请求删除文件
			function reqDeleteFileHandler( _xmlhttp ){
					if(_xmlhttp.readyState==4 && _xmlhttp.status==200){
							var rspText=_xmlhttp.responseText;
							if('1' == rspText){
									deleteSuc();
									upf.uploadedSuc=false;
									upf.extName="";
									upf.$img.attr("src", "");
							}else{
									deleteFailed();
									alert("删除失败");
							}
					}//end if
			}//end funcDef
			/*ajax请求处理函数--end*/

			/*状态转换函数--start*/
			//上传过程
			function uploadProcess(){
					upf.$imgCover.unbind("click");
					upf.$imgCover.css({backgroundImage:"", backgroundColor:"#FFF"});
					upf.$uploadingSpan.removeClass("upf_gifHide");
			}
			//上传成功
			function uploadSuc(){
					upf.$imgCover.fadeOut("normal", function(){					//渐隐"添加图片"，渐显"上传图片"
							upf.$imgCover.addClass("upf_imgCoverHide").css("display", "");			//一致性并消除fadeOut的影响
							upf.$imgWrap.fadeIn("slow").removeClass("upf_imgWrapHide");
					})
					upf.uploadedSuc=true;

					upf.refreshFileChoose();		//重新生成input=file
			}
			//上传失败
			function uploadFailed(){
					upf.$imgCover.css({backgroundImage:"url("+opt.addIcoPath+")"});
					upf.$uploadingSpan.addClass("upf_gifHide");
					
					//主要针对于uploadedModel中，获取不到图片的情况
					upf.$imgCover.click(function(){			//重新imgCover点击事件
							upf.$fileChoose.click();
					});

					upf.refreshFileChoose();		//重新生成input=file
			}
			//删除过程
			function deleteProcess(){
					upf.$imgWrap.css("display", "").addClass("upf_imgWrapHide");
					upf.$imgCover.css({backgroundImage:"", backgroundColor:"#FFF"}).removeClass("upf_imgCoverHide");
					upf.$uploadingSpan.addClass("upf_gifHide");
					upf.$delingSpan.removeClass("upf_gifHide");
			}
			//删除成功
			function deleteSuc(){
					upf.$imgCover.click(function(){			//重新imgCover点击事件
							upf.$fileChoose.click();
					});
					upf.$delingSpan.addClass("upf_gifHide");
					upf.$imgCover.css({backgroundImage:"url("+opt.addIcoPath+")", backgroundColor:"transparent"});
			}
			//删除失败
			function deleteFailed(){
					upf.$imgCover.fadeOut("slow", function(){
							upf.$imgCover.css("display", "").addClass("upf_imgCoverHide");
							upf.$imgWrap.fadeIn("slow");
					});
			}
		/*状态转换函数--end*/
}//end funcDef-FileUploader