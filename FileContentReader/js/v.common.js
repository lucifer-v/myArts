/*
*0.2版
*changelog: 添加html 页面处理函数，指定了页面处理规则，加快开发效率
*/

/*添加数组类型的原型方法
 *删除数组内的某个元素("值")
*/
Array.prototype.rmvElem=function(_el){
	var index=this.indexOf(_el);
	if(index > -1){
		this.splice(index, 1);
	}
};//end funcDef-rmvElem

/*
*判断两个数组是否相等(忽略顺序)
*/
function is2ArysValSame(_ary1, _ary2){
	return (_ary1.sort().join('')==_ary2.sort().join(''));
}//end funcDef-is2ArysValSame

/*
*判断两个数组是否严格相等(考虑顺序)
*/
function is2ArysStrictSame(_ary1, _ary2){
	if(_ary1.length!=_ary2.length){
		return false;
	}
	var len=_ary1.length;
	for(var i=0; i<len; i++){
		if(_ary1[i]!=_ary2[i]){
			return false;
		}
	}
		return true;
}//end funcDef-is2ArysStrictSame



/*String原型方法
*字符串首字母大写
*/
String.prototype.ucfirst=function(){
	if(!!!this)	 { return;}		//如果空，返回

	var ascii=this.charCodeAt(0);
	if(ascii>=97 && ascii<=122){		//如果是大写字母
			ascii-=32;
	}
	return String.fromCharCode(ascii)+this.substring(1);
};

/*String原型方法
*字符串首字母小写
*/
String.prototype.lcfirst=function(){
	if(!!!this)	 { return;}		//如果空，返回

	var ascii=this.charCodeAt(0);
	if(ascii>=65 && ascii<=90){		//如果是大写字母
		ascii+=32;
	}
	return String.fromCharCode(ascii)+this.substring(1);
};

/*
*浅拷贝一个对象面向过程版
*/
function shallowCopy(_obj){ 
	var newObj=new Object();
	for(attr in _obj){
		newObj[attr]=_obj[attr];
	}
	return newObj;
}

/*获取查询字符串中的参数*/
function getQueryStringArgs(){
	var qs=(location.search.length>0 ? location.search.substring(1):""),
	args={},

	items=qs.length?qs.split("&"):[],
	item=null,
	name=null,

	i=0,
	len=items.length;
			
	for(i=0; i<len; i++){
		item=items[i].split('=');
		name=decodeURIComponent(item[0]);
		value=decodeURIComponent(item[1]);
		if(name.length){
			args[name]=value;
		}
	}
	return args;
}//end funcDef-getQueryStringArgs
	
	/*获取XMLHttpRequest对象(兼容)*/
	function getXmlHttp(){
		var xmlhttp=null;
		if(window.XMLHttpRequest){
			xmlhttp=new XMLHttpRequest();		
		}else{
			xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		return xmlhttp;
	}

	/*字符串是否是整数*/
	function isInteger(_str){
		return /^\d+$/.test(_str);
	}

	/*粗劣检测日期是否合法*/
	function checkDateInExact(_date){
		return /^20\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])$/.test(_date);
	}
	
	//截断字符串，显示其前_len位，然后后续_followStr字符串
	function truncateStr(_str, _len, _followStr){
		var str=_str.substr(0, _len);
		if(_str.length>_len){
			str=str+_followStr;
		}

		if(""!=_str){
			return str;
		}else{
			return _str;	
		}
	};//end funcDef

	/*
	*Ajax请求发送函数
	*GET方式
	*通用函数
	*/
	function sendAjaxGetReq(_xmlhttp, _url, _callback, _para){
		/*创建xmlhttp对象*/
		if(window.XMLHttpRequest){
			_xmlhttp=new XMLHttpRequest();
		}else{
			_xmlhttp=ActiveXObject("Microsoft.XMLHTTP");
		}
		_xmlhttp.onreadystatechange=function(){
			_callback(_xmlhttp, _para);
		}
		_xmlhttp.open("GET", _url, true);
		_xmlhttp.send();

	}//funcDef-sendAjaxGetReq

	/*
	*Ajax请求发送函数
	*POST方式
	*通用函数
	*/
	function sendAjaxPostReq(_xmlhttp, _url, _callback, _dataStr, _para){
	if(window.XMLHttpRequest){
		_xmlhttp=new XMLHttpRequest();
	}else{
		_xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	_xmlhttp.onreadystatechange=function(){
		_callback(_xmlhttp, _para);
	}
	_xmlhttp.open("POST", _url, true);
	_xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
	_xmlhttp.send(_dataStr);

}//end funcSendAjaxPostReq

	/*
	 *通过ajax发送时，表单控件数据处理函数
	 *通用函数
	 */
	function turnToPostDataStr(_fieldAry, _assocAry){
		var str="";
		var len=_fieldAry.length;
		for(var i=0; i<len; i++){
			var field=_fieldAry[i];
			var ary=_assocAry[field];
			var num=ary.length;
			for(var j=0; j<num; j++){
				str+=(field+"[]="+ary[j]+"&");
			}//end for
		}//end for
		return str;
	}//end funcDef-turnToPostDataStr

/*输入监控类start*/
/*func:仅仅允许输入的字符串为整数
 *argu:_keyCode [in] 键码
 *return:如果是，则返回true；如果不是，则返回false
 *auth:lucifer
 *date:2014/4/16
 */
function allowIntegerKeyInput(_keyCode){
	if((_keyCode>=48 && _keyCode<=57) || 8==_keyCode || 9==_keyCode ||  37==_keyCode 
		|| 39==_keyCode || (_keyCode>=96 && _keyCode<=105)){
		return true;
	}else{
		return false;
	}
}//end funcDef-allowIntegerKeyInput

/*func:仅仅允许输入英文标识符所允许的字符
 *argu:_keyCode [in] 键码，_shiftKey [in] 1表示shift键按下 0表示shift键未被按下
 *return:如果是，则返回true；如果不是，则返回false
 *auth:lucifer
 *date:2014/4/16
 */
function allowStandardCharInput(_keyCode, _shiftKey){
	if((_keyCode<=57 && _keyCode>=48) || _keyCode==8 || _keyCode==37 || _keyCode==39 || 
		(_keyCode>=96 && _keyCode<=105) || (_keyCode>=65 && _keyCode<=90) || (1==_shiftKey&&_keyCode==189)){
		return true;
	}
	return false;
}//end funcDef-allowStandardCharInput
/*输入监控类end*/

/*输入验证类start*/
/*func:检测所输入的字符串是否为整数
 *argu:_str [in] 待检测的字符串
 *return:如果是，则返回true；如果不是，则返回false
 *auth:lucifer
 *date:2014/4/16
 */
 function isValidInteger(_str){
	return /^\d+$/.test(_str);
 }//end funcDef-isValidInteger

/*func:检测是否是合法的utf8中文字符串
 *argu:_str [in] 待检测的字符串
 *return:如果是，则返回true；如果不是，则返回false
 *auth:lucifer
 *date:2014/4/16
 */
function isValidUtf8CnStr(_str){
	return /^[\u4e00-\u9fa5]+$/.test(_str);
}//end funcDef-isValidUtf8CnStr

/*func:检测给定字符串是否为纯英文字符串
 *argu:_str [in] 待检测的字符串
 *return:如果是，则返回true；如果不是，则返回false
 *auth:lucifer
 *date:2014/4/16
 */
function isValidEnStr(_str){
	return /^[a-zA-Z]+$/.test(_str);
}//end funcDef-isValidEnStr

/*func:检测给定字符串是否为标准英文标识符字符串
 *argu:_str [in] 待检测的字符串
 *return:如果是，则返回true；如果不是，则返回false
 *auth:lucifer
 *date:2014/4/16
 */
function isValidStandardEnStr(_str){
	return /^(_|[a-zA-Z])[_a-zA-Z\d]*$/.test(_str);
}//end funcDef-isValidStandardEnStr

/*func:检测给定字符串是否为变准utf8标识符字符串
 *argu:_str [in] 待检测的字符串
 *return:如果是，则返回true；如果不是，则返回false
 *auth:lucifer
 *date:2014/4/16
 */
function isValidStandardUtf8Str(_str){
	return /^(_|[a-zA-Z\u4e00-\u9fa5])[_a-zA-Z\d\u4e00-\u9fa5]*$/.test(_str);
}//end funcDef-isValidStandardUtf8Str
/*输入验证类end*/

/*数据存储---start*/
//cookie
//获取cookie
	function getCookie(_ckName){
		var ckStr=decodeURIComponent(document.cookie);
		var tmpAry=ckStr.split(";");
		var len=tmpAry.length;
		var cookieAry=new Array();
		for(var i=0; i<len; i++){
			var ary=tmpAry[i].trim().split('=');			//一定要注意trim()
			cookieAry[ary[0]]=ary[1];
		}
		if(!!cookieAry[_ckName]){
			return cookieAry[_ckName];
		}
		return "";
	}

	/*
	  *删除指定名称的cookie
	  *_ckName [in]  cookie名称
	  *_path		  [in] 可访问cookie目录(默认为所有页面)
	  *_domain [in] 可访问的cookie的主机名(默认为当前域名下)
	*/
	function delCookie(_ckName, _path, _domain){
		document.cookie=_ckName+"=; expires="+(new Date(0)).toGMTString()+";path="+_path+";domain="+_domain;
	}

	/*
	  *设置cookie
	  *_ckName [in]  cookie名称
	  *_ckValue [in] cookie值
	  *_expires [in] 单位:天
	  *_path		  [in] 可访问cookie目录(默认为所有页面)
	  *_domain [in] 可访问的cookie的主机名(默认为当前域名下)
	*/
	function setCookie(_ckName, _ckValue, _expires, _path, _domain){
		var curDate=new Date();
		curDate.setTime(curDate.getTime()+_expires*24*3600*1000);
		document.cookie=encodeURIComponent(_ckName)+"="+encodeURIComponent(_ckValue)+
		(!!_expires?";expires="+curDate.toGMTString():"")+
		(!!_path?";path="+_path:"")+
		(!!_domain?";domain="+_domain:"");
	}
/*数据存储---end*/

/*日期时间随机数---start*/
function getDateStamp(){
	var curDate=new Date();
	var year=curDate.getFullYear().toString();
	var month=(curDate.getMonth()+1).toString();
	var date=curDate.getDate().toString();
	return year+((1==month.length)?"0"+month:month)+((1==date.length)?"0"+month:date);
}

/*func:返回_len位的十进制随机数
 *argu:_len [in] 待返回的十进制随机数的位数
 *return:返回随机数
 *auth:lucifer
 *date:2014/05/07
 */
function getRandom(_len){
	if( null == _len ){  _len = 5; }
	var rand=Math.random();
	var from=Math.pow(10, _len-1);
	var to=Math.pow(10, _len)-1;
	return Math.floor(rand*(to-from)+from);
}
/*日期时间---end*/

/*moka业务函数*/
//镶口大小值输入是否有效
function isValidMountSz(_iVal){
	var iVal=parseInt(_iVal);
	if(0==_iVal%5 && (_iVal>=0 && _iVal<=100) ){
		return true;
	}else{
		return false;
	}
}//end funcDef-isValidMountSz


/*v-page*/
function initiatePage(){
		return {
				txtSet		:		(function(){
													var retSet = {};
													var $set = $("input[id^=txt]");
													$set.each(function(){
															retSet[this.id.substring(4)] = $(this);
													});
													return retSet;
											})(),
				btnSet :		(function(){
												var retSet = {};
												var $set = $("input[id^=btn], a[id^=btn]");
												$set.each(function(){
														retSet[this.id.substring(4)] = $(this);
												});
												return retSet;
										})(),
				 selcSet :	(function(){
												var retSet = {};
												var $set = $("select[id^=selc]");
												$set.each(function(){
														retSet[this.id.substring(5)] = $(this);
												});
												return retSet;
									})(),
				 validSet : {}
		}
}//end initiatePage

/**
  *当表达式_express为真时，调用_callback，并为之传递_args(对象格式)
  *如果表达式不为真，那么每隔_interval时间调用doUntil一次，调用_times满为止
  *参数对象_args中的属性要人为地和_callback中使用的属性保持一致
  */
function doUntil(_express, _times, _interval, _callback, _args){						
		if(_express){
				_callback(_args);
				return;
		}
		if( 0!=_times){
				_times--;
				setTimeout(function(){
						doUntil(_express, _times, _interval, _callback, _args);
				}, _interval);
		}
}//end doUntil

/**
  *字符串处理函数.
  *
  *翻制PHP中的strPad 暂时没有实现 STR_PAD_BOTH
  *
  *_padType的值有 STR_PAD_LEFT|STR_PAD_RIGHT 默认为STR_PAD_LEFT
  */
function strPad(_input, _padLength, _padString, _padType){
		var input = ''+_input, padString = '' + _padString;
		if(undefined == _padType){
				_padType = "STR_PAD_LEFT";
		}

		if("STR_PAD_LEFT" == _padType){
				while(input.length < _padLength){
						input = _padString + input;
				}
				//check if length exceed
				if(input.length > _padLength){
						var exceedLen = input.length - _padLength;
						input = input.substring(exceedLen, input.length);
				}
		}else if("STR_PAD_RIGHT" == _padType){
				while(input.length < _padLength){
									input += _padString;
				}
				//check if length exceed
				if(input.length > _padLength){
						var exceedLen = input.length - _padLength;
						input = input.substring(0, input.length - exceedLen);
				}
		}
		return input;
}