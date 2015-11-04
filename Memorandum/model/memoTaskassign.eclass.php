<?php

/*
  *@类名:MemoTaskassign
  *@数据表:tb_memo_taskassign
  *@依赖类:MysqlDBTool
  */
class MemoTaskassign {
		/*数据成员*/
		static     $s_fieldsMap = array(
																"m_taskNo" => "task_no",
																"m_reciver" => "reciver"
														);
		static		$G_MEMO_IS_RECIVER =	8;
		static		$G_MEMO_IS_SENT	 =	 4;
		static		$G_MEMO_IS_READ	= 2;
		static		$G_MEMO_IS_DONE	= 1;

		private $t_dbTool;
		private $m_tbName;

		private $m_taskNo;
		private $m_reciver;

		/*功能函数*/
		/**构造函数**/
		function __construct(
				$_dbTool = null,	
				$_tbName = null,
				$_taskNo = '',
				$_reciver =	''	){
				
				$this->t_dbTool		= $_dbTool;
				$this->m_tbName = $_tbName;
				$this->m_taskNo	=	$_taskNo;
				$this->m_reciver	= $_reciver;

		}//end funcDef-__construct
		
		/*
		  *@功能:将编号为m_taskNo的任务指派给 m_reciver
		  *@参数
		  *		[in] _dbTooling 正在执行事务的dbTool
		  *@返回值：
		  *		返回影响的行数
		  *@备注：有两种使用方法
		  *		1.[参与事务]	创建者在创建任务的同时，立即将任务指派给自己
		  *		2.[不参与事务] 创建者创建任务后，将任务指派给其他人
		  */
		public function assignTask($_dbTooling = null){
				$bDbToolEmpty = empty($_dbTooling);
				if( $bDbToolEmpty ){
						$dbTool = $this->t_dbTool;		//未参与事务,自己打开连接
						$dbTool->doCnnt();
				}else{
						$dbTool = $_dbTooling;
				}
				
				$sqlTpl = "insert into %s (task_no, reciver) values ('%s' , '%s')";
				$sqlStr = sprintf($sqlTpl, $this->m_tbName, $this->m_taskNo, $this->m_reciver);
				
				$affectedRows = $dbTool->exeDml($sqlStr);

				if( $bDbToolEmpty ){		//未参与事务，则关闭链接
						$dbTool->closeCnnt();
				}

				return $affectedRows;
		}//end funcDef-assignTask
		
		/*
		  *@功能:收回已经派遣的任务
		  *		使用task_no和reciver来唯一标识已经指派的任务
		  *@参数:
		  *		[in] _dbTooling 正在处理事务的MysqlDBTool对象
		  *@返回值：
		  *		返回影响的行数
		  *@备注：
		  *		[参与事务]	 创建者将任务指派项删除
		  */
		public function unassignTask($_dbTooling = null){
				$bDbToolEmpty = empty($_dbTooling);
				if( $bDbToolEmpty ){
						$dbTool = $this->t_dbTool;
						$dbTool->doCnnt();
				}else{
						$dbTool = $_dbTooling;
				}
				
				$sqlTpl = "delete from %s where task_no='%s' and reciver='%s'";
				$sqlStr = sprintf($sqlTpl, $this->m_tbName, $this->m_taskNo, $this->m_reciver);
				
				$affectedRows = $dbTool->exeDml($sqlStr);
				
				if( $bDbToolEmpty ){		//关闭自己创建的数据库连接
						$dbTool->closeCnnt();
				}
				return $affectedRows;
		}//end funcDef-unassignTask

		/*
		  *@功能:接收者阅读(打开)指派的任务
		  *@返回值：
		  *		false 打开失败(或指定接收者并没有接受到此项任务)
		  *		true  阅读成功
		  */
		public function readTask($_taskNo, $_reciver, $_memoTask){
				$dbTool = $this->t_dbTool;
				$dbTool->doCnnt();

				$sqlTpl = "select count(*) as num from tb_memo_taskassign  where task_no='%s' and reciver='%s'";
				$sqlStr = sprintf($sqlTpl, $_taskNo, $_reciver);

				$res = $dbTool->exeDql($sqlStr);
				$obj = mysql_fetch_object($res);

				if( 0 == $obj->num){		//如果任务没有给以指派
						return false;
				}

				//否则,reciver_read=1
				return $_memoTask->reciverReadTask($_taskNo);
		}//end func

		/*
		  *@功能:直接删除tb_memo_taskassign中指定了
		  *		使用task_no和reciver来唯一标识已经指派的任务
		  *@参数:
		  *		[in] _dbTooling 正在处理事务的MysqlDBTool对象
		  *@返回值：
		  *		返回影响的行数(1|2)
		  *@备注：有两种使用方法
		  *		1.[参与事务]	 创建者删除任务项的时候，随之删除
		  *		2.[不参与事务] 直接删除
		  */
		public function deleteByTaskNo($_taskNo, $_dbTool = null){
				$bDbToolEmpty = empty($_dbTool);
				if( $bDbToolEmpty){
						$dbTool = $this->t_dbTool;
						$dbTool->doCnnt();
				}else{
						$dbTool = $_dbTool;
				}
				
				$delTpl = "delete from %s where task_no = '%s'";
				$delStr = sprintf($delTpl, $this->m_tbName, $_taskNo);
				$affectedRows = $dbTool->exeDml($delStr);
				
				if( $bDbToolEmpty){
						$dbTool->closeCnnt();
				}
				return $affectedRows;
		}//end func-deleteByTaskNo

		/*
		  *@功能:'接收者'打开(阅读)任务
		  *		将tb_memo_taskassign指定项is_read=1
		  *@参数
		  *		[in] _taskNo 指定的任务编号
		  *		[in] _reciver 指定接收者
		  *@返回值:
		  *		true  任务打开(阅读)成功
		  *		false  任务打开(阅读)失败
		  */
		  public function openTask($_taskNo, $_reciver){
					$dbTool = $this->t_dbTool;
					$bRetVal = false;
					$dbTool->doCnnt();
					
					$updtTpl = "update %s set is_read=1 where task_no='%s' and reciver='%s'";
					$updtStr = sprintf($updtTpl, $this->m_tbName, $_taskNo, $_reciver);
					
					$affectedRows = $dbTool->exeDml($updtStr);
					
					if(1 == $affectedRows){
							$bRetVal = true;
					}
					
					$dbTool->closeCnnt();
					return $bRetVal;
		  }//end func-openTask

		/*@功能:计算备忘项的任务状态值
		  *    决定显示什么样的图标
		  *@参数: 
		  *		[in] $_taskObj 单个任务std对象
		  *@返回值:
		  *		任务状态值
		  */
		private function _calcTaskStateVal($_taskObj){
				$val = 0;
				if($_taskObj->reciver != $_taskObj->creator){		//如果是接收者
						$val += self::$G_MEMO_IS_RECIVER;
				}
				if(1 == $_taskObj->is_sent){		//如果已经发送
						$val += self::$G_MEMO_IS_SENT;
				}
				if(1 == $_taskObj->reciver_read){		//如果接收者已经已经阅读(即创建者也可以读接收者的状态)
						$val += self::$G_MEMO_IS_READ;
				}
				if(1 == $_taskObj->is_done){		//如果已经完成
						$val += self::$G_MEMO_IS_DONE;
				}
				return $val;
		}//end func-_calTaskStateVal

		/*@功能:  根据备忘项的状态值
		  *                  计算备忘项的类型标识,并返回
		  *@参数: 
		  *		[in] $_taskObj 单个任务std对象
		  *@返回值:
		  *		任务类型标识的相关css-class
		  *@备注:为$_taskObj添加属性typeFlag
		  */
		private function _calcTaskTypeFlag($_taskObj){
				$val = $this->_calcTaskStateVal($_taskObj);
				
				switch($val){
						case 0 : return " ";
						case 1 : 
						case 7 :
						case 15 :
										return "memo_ico_taskdown";
						case 4 : return "memo_ico_sentunread";
						case 6 :	return "memo_ico_senthasread";
						case 12 : return "memo_ico_rcvunread";
						case 14 : return "memo_ico_rcvhasread";
				}//switch
		}//end func-_calcTaskTypeFlag
		
		/*@功能:为给定的任务集合添加typeFlag属性
		  *@参数:待处理的任务集合
		  *@返回值:
		  *		处理以后的taskSet
		  */
		public function attachTaskTypeFlag($_taskSet){
				foreach($_taskSet as $task){
						$task->typeFlag = $this->_calcTaskTypeFlag($task);
				}
				return $_taskSet;
		}//end func-attachTaskTypeFlag
		
		/*@功能:计算备忘项的操作列表，并返回
		  *			    即不同状态下的备忘项有不同的操作
		  *@参数: 
		  *		[in] $_taskObj 单个任务std对象
		  *@返回值:
		  *		任务操作类型列表的html形式
		  *@备注:
		  *		单行的操作格式如下：(和前端保持一致)
		  *		<li><span id="memo_btn_msgsave" class="memo_ico_msgcreate"></span></li>
		  */
		public function _calcTaskOptList($_taskObj){
				$val = $this->_calcTaskStateVal($_taskObj);		//计算任务状态值
				$optsHtml = "";
				
				//$_taskObj->stateVal = $val;			//debug
				switch($val){
						case 0 : $optsHtml =	
												'<li><span id="memo_btn_msgsave" class="memo_ico_msgsave memo_ico_func" title="更新任务"></span></li>
												 <li><span id="memo_btn_msgdone" class="memo_ico_msgdone memo_ico_func" title="任务完成"></span></li>
												 <li><span id="memo_btn_msggplist" class="memo_ico_msggplist memo_ico_func" title="同事列表"></span></li>
												 <li><span id="memo_btn_msgdelete" class="memo_ico_msgdelete memo_ico_func" title="删除任务"></span></li>';
										break;
						case 1 : $optsHtml =
												'<li><span id="memo_btn_msgundone" class="memo_ico_msgundone memo_ico_func" title="撤销完成"></span></li>
												 <li><span id="memo_btn_msgdelete" class="memo_ico_msgdelete memo_ico_func" title="删除任务"></span></li>';
										break;
						case 4 :
						case 6 :	$optsHtml =	
												'<li><span id="memo_btn_msgback" class="memo_ico_msgback memo_ico_func" title="收回任务"></span></li>
												<li><span id="memo_btn_msgdelete" class="memo_ico_msgdelete memo_ico_func" title="删除任务"></span></li>';
										break;
						case 7 : $optsHtml = 
												'<li><span id="memo_btn_msgdelete" class="memo_ico_msgdelete memo_ico_func"  title="删除任务"></span></li>';
										break;
						case 15 : $optsHtml =	
												'<li><span id="memo_btn_msgundone" class="memo_ico_msgundone memo_ico_func"  title="撤销完成"></span></li>';
										break;
						case 12 : 
						case 14 : $optsHtml =	
												'<li><span id="memo_btn_msgsave" class="memo_ico_msgsave memo_ico_func"  title="更新任务"></span></li>
												<li><span id="memo_btn_msgdone" class="memo_ico_msgdone memo_ico_func" title="任务完成"></span></li>';
										break;
				}//end switch

				return $optsHtml;
		}//end func-_calcTaskOptList

		/*@功能:为给定的任务集合添加optList属性
		  *@参数:待处理的任务集合
		  *@返回值:
		  *		处理以后的taskSet
		  */
		public function attachTaskOptList($_taskSet){
				foreach($_taskSet as $task){
						$task->optList = $this->_calcTaskOptList($task);
				}
				return $_taskSet;
		}//end func-attachTaskTypeFlag

		/*@功能:为给定的任务集合添加time属性(H:i)
		  *@参数:待处理的任务集合
		  *@返回值:
		  *		处理以后的taskSet
		  */
		public function attachTaskCreateTime($_taskSet){
				foreach($_taskSet as $task){
						$task->time = date("H:i", $task->create_date);
						$task->date = date("Y.m.d", $task->create_date);
						$task->datetime = date("Y.m.d H:i", $task->create_date);
				}
				return $_taskSet;
		}//end func-attachTaskCreateTime

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
		
}//end clsDefine