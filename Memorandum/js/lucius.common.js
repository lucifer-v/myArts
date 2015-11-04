/*
*0.1版
*2014/08/11 引入了URL加密解密函数  base64_encode() base64_decode()
*/

/*添加数组类型的原型方法
 *删除数组内的某个元素("值")
*/
Array.prototype.rmvElem=function(_el){
	var index=this.indexOf(_el);
	if(index>-1){
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

/*获取查询字符串中的参数
 *2014/8/3改进 可以处理GET形式的查询字符串key[]=val1&key[]=val2的形式
*/
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

		//判读name是否是数组形式，如果是，单独处理
		if(/\[\]$/.test(name)){
			var trueName=name.substring(0, name.length-2);
			if(undefined==args[trueName]){
					args[trueName]=new Array();
			}
			args[trueName].push(value);
			continue;
		}//end

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
	return /^-?\d+$/.test(_str);
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

//得到毫秒时间戳
function getTimeStampMili(){
	return (new Date()).getTime();
}

//得到秒时间戳
function getTimeStempSec(){
	var mili=(new Date()).getTime();
	return Math.round(mili/1000);
}

/*func:返回_len位的十进制随机数
 *argu:_len [in] 待返回的十进制随机数的位数
 *return:返回随机数
 *auth:lucifer
 *date:2014/05/07
 */
function getRandom(_len){
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


/*URL加密*/
var base64encodechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; 
var base64decodechars = new Array( 
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 
52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, 
-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 
15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, 
-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 
41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1); 

function base64_encode(str) { 
var out, i, len; 
var c1, c2, c3; 
len = str.length; 
i = 0; 
out = ""; 
while (i < len) { 
c1 = str.charCodeAt(i++) & 0xff; 
if (i == len) { 
out += base64encodechars.charAt(c1 >> 2); 
out += base64encodechars.charAt((c1 & 0x3) << 4); 
out += "=="; 
break; 
} 
c2 = str.charCodeAt(i++); 
if (i == len) { 
out += base64encodechars.charAt(c1 >> 2); 
out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)); 
out += base64encodechars.charAt((c2 & 0xf) << 2); 
out += "="; 
break; 
} 
c3 = str.charCodeAt(i++); 
out += base64encodechars.charAt(c1 >> 2); 
out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)); 
out += base64encodechars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6)); 
out += base64encodechars.charAt(c3 & 0x3f); 
} 
return out; 
} 

function base64_decode(str) { 
var c1, c2, c3, c4; 
var i, len, out; 

len = str.length; 

i = 0; 
out = ""; 
while (i < len) { 

do { 
c1 = base64decodechars[str.charCodeAt(i++) & 0xff]; 
} while (i < len && c1 == -1); 
if (c1 == -1) 
break; 

do { 
c2 = base64decodechars[str.charCodeAt(i++) & 0xff]; 
} while (i < len && c2 == -1); 
if (c2 == -1) 
break; 

out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4)); 

do { 
c3 = str.charCodeAt(i++) & 0xff; 
if (c3 == 61) 
return out; 
c3 = base64decodechars[c3]; 
} while (i < len && c3 == -1); 
if (c3 == -1) 
break; 

out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2)); 

do { 
c4 = str.charCodeAt(i++) & 0xff; 
if (c4 == 61) 
return out; 
c4 = base64decodechars[c4]; 
} while (i < len && c4 == -1); 
if (c4 == -1) 
break; 
out += String.fromCharCode(((c3 & 0x03) << 6) | c4); 
} 
return out; 
} 

