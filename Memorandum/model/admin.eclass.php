<?php
/*
  *类名:Admin
  *数据表:tb_admin
  *依赖类:MysqlDBTool
  */
  class Admin {
		/*数据成员*/
		static		$s_fieldsMap = array("m_uname" => "uname",
																	"m_pwd"	=> "pwd",
																	"m_groupId" => "groupid");
		private $t_dbTool;
		private $m_tbName;
		
		private $m_uname;
		private $m_pwd;
		private $m_groupId;
	
		/*功能函数*/
		/*
		*名称：构造函数
		*功能：创建一个MemoTask对象
		*/
		public function __construct(
				$_dbTool = null,
				$_tbName = "",
				$_uname = "",
				$_pwd = "",
				$_groupId = 0	){
				
				$this->t_dbTool = $_dbTool;
				$this->m_tbName = $_tbName;
				$this->m_uname = $_uname;
				$this->m_pwd = $_pwd;
				$this->m_groupId = $_groupId;
				
		}//end func-__constructor

		/*@功能:获取所有的管理员列表
		  *@返回值:管理员stdObj对象
		  */
		public function retriAdminInfo(){
				$dbTool = $this->t_dbTool;
				$dbTool->doCnnt();
				$admSet = array();

				$sqlTpl = "select * from %s ";
				$sqlStr = sprintf($sqlTpl, $this->m_tbName);

				$res = $dbTool->exeDql($sqlStr);
				while($obj = mysql_fetch_object($res)){
						$admSet[] = $obj;
				}

				$dbTool->closeCnnt();
				return $admSet;
		}//end func-retriAdminInfo
		
		/*@功能:获取指定'管理员之外的'管理员对象列表
		  *@返回值:管理员stdObj对象
		  */
		public function retriAdminInfoExcept($_uname){
				$dbTool = $this->t_dbTool;
				$dbTool->doCnnt();
				$admSet = array();

				$sqlTpl = "select * from %s where uname!='%s'";
				$sqlStr = sprintf($sqlTpl, $this->m_tbName, $_uname);

				$res = $dbTool->exeDql($sqlStr);
				while($obj = mysql_fetch_object($res)){
						$admSet[] = $obj;
				}

				$dbTool->closeCnnt();
				return $admSet;
		}//end func-retriAdminInfoExcept

		/*get/set/toString*/
		public function __get($_name){
				return $this->$_name;
		}
		public function __set($_name, $_value){
				$this->$_name = $_value;
		}
		public function __toString(){
				$msg="Instance info:<br />";
				foreach( $this as $name=>$value){
						$msg.=($name."=".$value."<br />");
				}
				return $msg;
		}
  }//end cls