<?php
/*此类提供对sql数据库的基本操作*/
class MysqlDBTool
{
	private $m_cnnt	;				//mysql连接
	private $m_hostName;	//mysql所在的主机名
	private $m_userName;	//mysql用户名
	private $m_passWord;	//mysql密码
	private $m_dataBase;		//待使用的数据库名称

	//构造函数
	public function MysqlDBTool($_hostName, $_userName, $_passWord, $_dataBase)
	{
		$this->m_hostName=$_hostName;
		$this->m_userName=$_userName;
		$this->m_passWord=$_passWord;
		$this->m_dataBase=$_dataBase;
		$this->m_cnnt=null;

	}//end funcDef-MysqlDBTool
	
	//建立连接
	public function doCnnt()
	{
		//1.连接
		$this->m_cnnt=mysql_connect($this->m_hostName, $this->m_userName,$this->m_passWord) or die(mysql_error());
		//2.选择数据库
		mysql_select_db($this->m_dataBase,$this->m_cnnt);
		//3.设置操作编码
		mysql_query("set names utf8");

	}//end funcDef-doCnnt

	//关闭连接
	public function closeCnnt()
	{
		if($this->m_cnnt)		//如果不为空
		{
			mysql_close() or die(mysql_error());
		}
	}//end funcDef-closeCnnt

	//显示数据成员信息
	//辅助函数
	public function showMembs()
	{
		echo "hostName=".$this->m_hostName."<br/>";
		echo "userName=".$this->m_userName."<br/>";
		echo "passWord=".$this->m_passWord."<br/>";
		echo "dataBase=".$this->m_dataBase."<br/>";
	}//end funcDef-showMembs

	//执行dql语句，得到$res结果集
	public function exeDql($szDql)
	{
		$res=mysql_query($szDql, $this->m_cnnt) or die(mysql_error());
		return $res;

	}//end funcDef-exeDql

	//执行dml语句，返回结果
	//返回所影响的行数
	//查询失败则返回-1
	public function exeDml($szDml)
	{
		//mysql_query($szDml, $this->m_cnnt) or die(mysql_error());
		mysql_query($szDml, $this->m_cnnt);

		return mysql_affected_rows($this->m_cnnt);
	}//end funcDef-exeDml

	/******************get和set函数******************/
	public function __get($_name){
		return $this->$_name;
	}
	public function __set($_name, $_value){
		$this->$_name=$_value;
	}

	//返回关联数组集形式的查询结果
	public function retriAssocArys($_szDql){
			$assocArys=array();

			$this->doCnnt();
			$res=$this->exeDql($_szDql);
			while($assoc=mysql_fetch_assoc($res)){
				$assocArys[]=$assoc;
			}

			$this->closeCnnt();
			if($res){
				mysql_free_result($res);
			}
			return $assocArys;
	}//end funcDef-retriAssocArys

	//返回对象数组集形式的查询结果
	public function retriObjectAry($_szDql){
		$objAry=array();

		$this->doCnnt();
		$res=$this->exeDql($_szDql);
		while($obj=mysql_fetch_object($res))	{
			$objAry[]=$obj;
		}

		$this->closeCnnt();
		if($res){
			mysql_free_result($res);
		}
		return $objAry;
	}//end funcDef-retriObjectAry

	//返回对象数组级形式的查询结果(可以依次调用多个存储过程)
	public function prcd_retriObjectAry($_szDql){
		//先关闭原来的链接
		$this->closeCnnt();

		$mysqli=new mysqli($this->m_hostName, $this->m_userName, $this->m_passWord, $this->m_dataBase);
		$mysqli->query("set names utf8");

		$objectAry=array();
		if($resAry=$mysqli->multi_query($_szDql)){
			do{
				if($res=$mysqli->store_result()){
					while($row=$res->fetch_object()){
						$objectAry[]=$row;
					}
					$res->close();
				}
			}while($mysqli->next_result());
		}//end if

		//再打开原来的mysql链接
		$this->doCnnt();
		//关闭$mysqli链接
		$mysqli->close();
		return $objectAry;
	}//end prod_retriObjectAry

	/*构建单个数据表的插入字符串
	 * in $_fieldAry 字段 => 值  形式的关联数组
	 * in $_tbName 表名字
	*/
	public function buildInsertSql($_fieldAry, $_tbName){
		$size=count($_fieldAry);
		$counter=1;
		$fieldStr=$valStr="(";
		foreach($_fieldAry as $field => $val){
			if($size==$counter){
				$fieldStr.="{$field} )";
				$valStr.="'{$val}' )";
				continue;
			}
			$fieldStr.="{$field}, ";
			$valStr.="'{$val}', ";
			$counter++;
		}//end foreach
		$sql="insert into {$_tbName} {$fieldStr} values {$valStr} ";
		return $sql;
	}//end buildInsertSql

	/*构建数据表的更新sql字符串
	 *可以适用于多个主键
	*/
	public function buildUpdateSql($_fieldAry, $_tbName, $_primaryAry){
		$sql="update {$_tbName} set ";
		$condi=" 1=1 ";
		foreach($_fieldAry as $field => $val){
			$sql.=($field."='{$val}', ");
		}
		foreach($_primaryAry as $field => $val){
			$sql.=($field."='{$val}'");
			$condi.=("and ".$field."='{$val}'");
		}
			$sql.=" where {$condi}";
			return $sql;
	}//end func

	public function __toString(){
			return "MysqlDBTool";
	}

}//end classDef
?>