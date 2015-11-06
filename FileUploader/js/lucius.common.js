/*添加数组类型的原型方法
 *删除数组内的某个元素("值")
*/
Array.prototype.rmvElem=function(_el){
	var index=this.indexOf(_el);
	if(index>-1){
		this.splice(index, 1);
	}
};//end funcDef-rmvElem

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
 *argu:_str [in] 待检测的字符串
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
