<?php
/*
  *类名:MemoTask
  *数据表:tb_memo_task
  *依赖类:MysqlDBTool, MemoTaskassign
  */
  class MemoTask {
		/*数据成员*/
	static	$s_fieldsMap = array(	"m_taskNo"	=> "task_no",
																"m_seqNo"	=> "seq_no",
																"m_creator" => "creator",
																"m_createDate"	=>	"create_date",
																"m_isSent"	=>	"is_sent",
																"m_isDone"	 =>	"is_done",
																"m_othReciver" => "oth_reciver",
																"m_reciverRead" => "reciver_read",
																"m_subject" => "subject",
																"m_comments"=> "comments",
																"m_solver" => "solver",
																"m_solveDate" => "solveDate",
																"m_lastModifyDate" => "lastmodify_date"																	
																);
		private $t_dbTool;
		private $m_tbName;

		private $m_taskNo;
		private $m_seqNo;
		private $m_creator;
		private $m_createDate;
		private $m_isSent;
		private $m_isDone;
		private $m_othReciver;
		private $m_reciverRead;
		private $m_subject;
		private $m_comments;
		private $m_solver;
		private $m_solveDate;
		private $m_lastModifyDate;

		/*功能函数*/
		/*
		*名称：构造函数
		*功能：创建一个MemoTask对象
		*/
		public function __construct(
				$_dbTool = null,
				$_tbName = "",
				$_taskNo = "",
				$_seqNo = 0,
				$_creator = "",
				$_createDate = 0,
				$_isSent = 0,
				$_isDone = 0,
				$_othReciver = "",
				$_reciverRead = 0,
				$_subject = "",
				$_comments = "",
				$_solver = "",
				$_solveDate = 0,
				$_lastModifyDate = 0){
				
				$this->t_dbTool = $_dbTool;
				$this->m_tbName = $_tbName;

				$this->m_taskNo = $_taskNo;
				$this->m_seqNo = $_seqNo;
				$this->m_creator = $_creator;
				$this->m_createDate = $_createDate;
				$this->m_isSent = $_isSent;
				$this->m_isDone = $_isDone;
				$this->m_othReciver = $_othReciver;
				$this->m_reciverRead = $_reciverRead;
				$this->m_subject = $_subject;
				$this->m_comments = $_comments;
				$this->m_solver = $_solver;
				$this->m_solveDate = $_solveDate;
				$this->m_lastModifyDate = $_lastModifyDate;
				
		}//end func-__constructor
		
		/*
		  *@功能:获取备忘录任务当前最大的序列号
		  *@参数:
		  *		[in] _dbTool MysqlDBTool对象
		  *@返回值:
		  *		-1:如果还没有表项
		  *		当前最大的序列号:如果已经存在表项
		  */
		static	function retriCurMaxSeqNo($_dbTool, $_tbName){
				$_dbTool->doCnnt();
				
				$sqlTpl = "select seq_no from %s order by seq_no desc limit 0,1 ";
				$sqlStr = sprintf($sqlTpl, $_tbName);

				$res = $_dbTool->exeDql($sqlStr);
				$obj = mysql_fetch_object($res);
				$_dbTool->closeCnnt();

				if(false == $obj){		// 如果没有查询到
						return -1;
				}else{
						return $obj->seq_no;
				}
		}//end func-retriCurMaxSeqNo
		
		/*
		  *@功能:获取备忘录任务当前最大的序列号
		  *@参数:
		  *		[in] _dbTool MysqlDBTool对象
		  *@返回值:
		  *		下一个可用的序列号
		  */
		static function buildNewSeqNo($_dbTool, $_tbName){
				$curMaxSeqNo = intval(MemoTask::retriCurMaxSeqNo($_dbTool, $_tbName));

				$newSeqNo = 1;
				
				if( -1 !=$curMaxSeqNo ){		//如果存在表项
						$newSeqNo = $curMaxSeqNo + 1;		
				}

				return $newSeqNo;
		}//end func-buildNewTaskNo
		
		/*
		  *@功能:根据给定的seqNo构建taskNo
		  *@参数:
		  *		[in] _seqNo 用户创建taskNo的seqNo
		  *@返回值:
	      *		新的taskNo	
		  */
		static function buildNewTaskNo($_seqNo){
				return 'TSK_'.$_seqNo;
		}//end func-buildNewTaskNo

		/*
		  *@功能:创建一项任务，并指派给自己
		  *@事务:sucStep = 2
		  *@参数
		  *		[in] _memoTaskAssign  MemoTaskAssign任务指派对象
		  *@返回值:
		  *		true  创建成功
		  *		false  创建失败
		  *@备注
		  *		注意MemoTask和MemoTaskassign的assignTask()的区别
		  */
		public function createTask($_memoTaskAssign){
				$dbTool = $this->t_dbTool;
				$bRetVal = false;
				$sucStep = 0;

				$dbTool->doCnnt();
				$dbTool->exeDql("begin");

				//创建任务
				$insertTpl = "insert into %s (task_no, seq_no, creator, create_date, is_sent, is_done, oth_reciver, reciver_read, ".		
						"subject, comments, solver, solve_date, lastmodify_date) values ".
						"('%s', %d, '%s', %d, %d, %d, '%s', %d, '%s', '%s' , '%s',  %d, %d)";
				$insertStr = sprintf($insertTpl, $this->m_tbName, $this->m_taskNo, $this->m_seqNo, $this->m_creator,		
						$this->m_createDate, $this->m_isSent, $this->m_isDone, $this->m_othReciver,$this->m_reciverRead, 
					    $this->m_subject, $this->m_comments, $this->m_solver,	$this->m_solveDate, $this->m_lastModifyDate );
				$sucStep += $dbTool->exeDml($insertStr);
			
				//指派任务给自己
				$sucStep += $_memoTaskAssign->assignTask($dbTool);

				if( 2 == $sucStep ){
						$dbTool->exeDql("commit");
						$bRetVal = true;
				}else{
						$dbTool->exeDql("rollback");
				}
			
				$dbTool->closeCnnt();
				return $bRetVal;
		}//end func-createTask
		
		/*
		  *@功能:将任务指派给其他人
		  *@事务:sucStep=2
		  *		[1] 添加tb_memo_taskassign任务指派表项
		  *		[2] 修改tn_memo_memo_task对应项的is_sent字段置为1
		  *@参数
		  *		[in] _memoTaskAssign  MemoTaskAssign任务指派对象
		  *		[in]	 _taskNo 带指派的任务
		  *		[in] _othReciver 任务的接收者
		  *@返回值:
		  *		true  任务指派成功
		  *		false  任务指派失败
		  */
		  public function assignTask($_memoTaskAssign, $_taskNo, $_othReciver){
					$_memoTaskAssign->m_taskNo = $_taskNo;
					$_memoTaskAssign->m_reciver = $_othReciver;
					
					$dbTool = $this->t_dbTool;
					$bRetVal =false;
					$sucStep = 0;

					$dbTool->doCnnt();
					$dbTool->exeDql("begin");
					
					//插入任务指派项
					$sucStep += $_memoTaskAssign->assignTask($dbTool);

					//更新消息状态
					$updtTpl = "update %s set is_sent=1, oth_reciver='%s' where task_no='%s'";
					$updtStr = sprintf($updtTpl, $this->m_tbName, $_othReciver, $_taskNo);
					$sucStep += $dbTool->exeDml($updtStr);
					
					if(2 == $sucStep){
							$dbTool->exeDql("commit");
							$bRetVal = true;
					}else{
							$dbTool->exeDql("rollback");
					}

					$dbTool->closeCnnt();
					return $bRetVal;
		  }//end func-assignTask

		/*
		  *@功能:将指派出的任务收回
		  *@事务:sucStep=2
		  *		[1] 删除tb_memo_taskassign任务指派表项
		  *		[2] 修改tb_memo_task对应项的is_sent字段置为0 | reciver_read置为0
		  *@参数
		  *		[in] _memoTaskAssign  MemoTaskAssign任务指派对象
		  *		[in]	 _taskNo 带指派的任务
		  *		[in] _othReciver 任务的接收者
		  *@返回值:
		  *		true  任务收回成功
		  *		false  任务收回失败
		  */
		  public function unassignTask($_memoTaskAssign, $_taskNo, $_othReciver){
					$_memoTaskAssign->m_taskNo = $_taskNo;
					$_memoTaskAssign->m_reciver = $_othReciver;
					
					$dbTool = $this->t_dbTool;
					$sucStep = 0;
					$bRetVal =false;

					$dbTool->doCnnt();
					$dbTool->exeDql("begin");
					
					//删除指定项
					$sucStep += $_memoTaskAssign->unassignTask($dbTool);
				
					//修改tb_memo_task项
					$updtTpl = "update %s set is_sent=0, reciver_read=0, oth_reciver='' where task_no='%s'";
					$updtStr = sprintf($updtTpl, $this->m_tbName, $_taskNo);
					$sucStep += $dbTool->exeDml($updtStr);

					if(2 == $sucStep){
							$dbTool->exeDql("commit");
							$bRetVal = true;
					}else{
							$dbTool->exeDql("rollback");
					}

					$dbTool->closeCnnt();
					return $bRetVal;
		  }//end func-unassignTask

		/*
		  *@功能:删除一项任务，并删除其所有的指派
		  *@事务:sucStep = 2|3
		  *		[1] 删除tb_memo_task 中的指定项
		  *		[2] 删除tb_memo_taskassign 中的指定项(1或2项) 
		  *@参数
		  *		[in] _memoTaskAssign  MemoTaskAssign任务指派对象
		  *@返回值:
		  *		true  删除成功
		  *		false  删除失败
		  */
		public function deleteTask($_memoTaskAssign, $_taskNo){
				$dbTool = $this->t_dbTool;
				$bRetVal = false;
				$sucStep = 0;
				
				$dbTool->doCnnt();
				$dbTool->exeDql("begin");

				//删除tb_memo_task项
				$delTpl = "delete from %s where task_no='%s'";
				$delStr = sprintf($delTpl, $this->m_tbName, $_taskNo);
				$sucStep += $dbTool->exeDml($delStr);
					
				//删除tb_memo_taskassign对应项
				$sucStep += $_memoTaskAssign->deleteByTaskNo($_taskNo, $dbTool);

				if($sucStep >=2){
						$dbTool->exeDql("commit");
						$bRetVal = true;
				}else{
						$dbTool->exeDql("rollback");
				}

				$dbTool->closeCnnt();
				return $bRetVal;
		}//end func-deleteTask
		
		/*
		  *@功能:处理'任务接收者'打开|阅读任务
		  *@参数
		  *		[in] _taskNo
		  *@返回值:
		  *		true  打开成功
		  *		false  打开失败
		  */
		public function reciverReadTask($_taskNo){
				$dbTool = $this->t_dbTool;
				$bRetVal = false;

				$sqlTpl = "update %s set reciver_read=1 where task_no='%s'";
				$sqlStr = sprintf($sqlTpl, $this->m_tbName, $_taskNo);
				
				$affectedRows = $dbTool->exeDml($sqlStr);
				if(1 == $affectedRows){
						$bRetVal = true;
				}
				return $bRetVal;
		}//end func-reciverReadTask

		/*
		  *@功能:更新任务的内容(标题或备注)
		  *@返回值:
		  *		true	更新成功
		  *		false	更新失败
		  *@依赖函数:(因为更新项不固定)
		  *		MysqlDBTool::buildUpdateSql()
		  *		MemoTask::_buildUpdtFieldMap()
		  *@伪代码:
		  *		1.先使用_buildUpdtFieldMap()构建要更新的数据表字段映射
		  *		2.删除待更新字段中的重复部分
		  *		3.获取更新字符串
		  */
		public function updateTask(){
				$dbTool = $this->t_dbTool;
				$bRetVal =false;
				$dbTool->doCnnt();
				
				$fieldsMap = $this->_buildUpdtFieldMap();
				$primaryKeyMap = array("task_no" => $fieldsMap['task_no']);
				unset($fieldsMap['task_no']);			//删除待更新字段的主键部分
				
				$updtStr = $dbTool->buildUpdateSql($fieldsMap, $this->m_tbName, $primaryKeyMap);
				$affectedRows = $dbTool->exeDml($updtStr);
				
				if( 1 == $affectedRows ){
						$bRetVal = true;
				}
				return $bRetVal;
		}//end func-updateTask

		/*
		  *@功能:任务完成
		  *@返回值:
		  *		true	更新成功
		  *		false	更新失败
		  */
		public function taskDone($_taskNo, $_solver){
				$dbTool = $this->t_dbTool;
				$bRetVal = false;
				$dbTool->doCnnt();

				$updtTpl = "update %s set is_done=1, solver='%s', solve_date=%d where task_no='%s'";
				$updtStr = sprintf($updtTpl, $this->m_tbName, $_solver, time(), $_taskNo);
				$affectedRows = $dbTool->exeDml($updtStr);

				if( 1 == $affectedRows ){
						$bRetVal = true;
				}
				
				$dbTool->closeCnnt();
				return $bRetVal;
		}//end func-taskDone

		/*@功能:撤销任务完成
		  *		需要设置mt对象的tbName属性
		  *@返回值:
		  *		true	撤销成功
		  *		false	撤销失败
		  */
		public function taskUndone($_taskNo){
				$dbTool = $this->t_dbTool;
				$bRetVal = false;
				$dbTool->doCnnt();

				$updtTpl = "update %s set is_done=0, solver='', solve_date=0 where task_no='%s'";
				$updtStr = sprintf($updtTpl, $this->m_tbName, $_taskNo);
				$affectedRows = $dbTool->exeDml($updtStr);

				if( 1 == $affectedRows ){
						$bRetVal = true;
				}
				
				$dbTool->closeCnnt();
				return $bRetVal;
		}//end func-taskUndone
		
		/*@功能:检测某人在给定的日期(yyyy-mm-dd)之前是否有没有完成的任务
		  *@参数:
		  *		[in] $_date 进行检测的基点日记
		  *		[in] $_reciver 任务的接收者
		  *@返回值:
		  *		true	存在没有完成的任务
		  *		false	不存在没有完成的任务
		  */
		public function existTaskUndone($_date, $_reciver){
				$bRetVal = false;
				$timeStamp = strtotime($_date." 00:00:00");
				
				$sqlTpl = "select sum(meta.id) as num from %s  as meta 
									join tb_memo_taskassign as mets on meta.task_no=mets.task_no 
									where create_date<%d and mets.reciver='%s' and meta.is_done=0";
				$sqlStr = sprintf($sqlTpl, $this->m_tbName, $timeStamp, $_reciver);

				$dbTool = $this->t_dbTool;
				$dbTool->doCnnt();
				$res = $dbTool->exeDql($sqlStr);
				$obj = mysql_fetch_object($res);
	
				mysql_free_result($res);
				$dbTool->closeCnnt();

				if($obj->num > 0){
						$bRetVal = true;
				}

				return $bRetVal;
		}//end func-existTaskUndone
		
		/*@功能:统计某人 在 给定时间段 的任务总数和任务完成总数(统计单位:天)
		  *@返回值:
		  *		 statisticAssocAry: 
		  *		array(	'yyyy-mm-dd' => 
										array("totalTaskNum" => ?? 
													"taskDoneNum" => ?? )	
								)
		  *@备注：
		  *		返回的每一天的信息中要含有当天的总任务数totalTaskNum，
		  *		以及已经完成的任务数taskDoneNum
		  *		 用于为日历单元格添加"任务标识"
		  *		查询出的结果一定要按照升序排列
		  *@伪代码:
		  *		 1.获取在 _fromDay 到 _toDay之前的所有任务stdObject(注意最后一天的时间戳边界)
		  *		 2.生成时间戳数组
		  *		 3.生成统计数据(键为时间戳), 删除辅助日期边界
		  *		 4.将上一步得到的数组键修改为 yyyy-mm-dd形式
		  */
		public function retriTaskCompleteInfo($_fromDay, $_toDay, $_reciver){
				$iDaySec = 24*3600;
				$iFromTimeStamp = strtotime($_fromDay." 00:00:00");
				$iToTimeStamp = strtotime($_toDay." 00:00:00") + $iDaySec;
				
				//1
				$dbTool = $this->t_dbTool;
				$dbTool->doCnnt();
				$sqlTpl = "select meta.task_no, meta.create_date, meta.is_done from %s as meta
									 join tb_memo_taskassign as mets on meta.task_no=mets.task_no 
									 where %d<=meta.create_date and meta.create_date<%d and mets.reciver='%s' 
									 order by meta.create_date asc";
				$sqlStr =	sprintf($sqlTpl, $this->m_tbName, $iFromTimeStamp, $iToTimeStamp, $_reciver);

				$objs = array();
				$res = $dbTool->exeDql($sqlStr);
				while($obj = mysql_fetch_object($res)){
						$objs[] = $obj;
				}
				$objSize = count($objs);

				//2  一般是获取一个月的
				$timeStampAry = range($iFromTimeStamp, $iToTimeStamp, $iDaySec);
				$arySize = count($timeStampAry);

				//3
				$tmpAry = array();
				$objIndex = 0;
				foreach($timeStampAry as $timeStamp){
						$tmpAry[$timeStamp] = array("totalTaskNum"=>0, "taskDoneNum"=>0);
				}
				for($i = 0; $i < $arySize-1; $i++){
						$today = $timeStampAry[$i];
						$nextDay = $timeStampAry[$i+1];

						for(; $objIndex < $objSize; $objIndex++){
								$obj = $objs[$objIndex];

								if( $today <= $obj->create_date && $obj->create_date < $nextDay){
										$tmpAry[$today]['totalTaskNum']++;
										if(1 == $obj->is_done){		$tmpAry[$today]['taskDoneNum']++;	}
								}else{
										break;
								}
						}//for
				}//for
				unset($tmpAry[$iToTimeStamp]);

				//4.
				$statisticAry = array();
				foreach($tmpAry as $timestamp => $ary){
						$statisticAry[date("Y-m-d", $timestamp)] = $ary;
				}

				$dbTool->closeCnnt();
				return $statisticAry;
		}//end func-retriTaskCompleteInfo

		/*@功能:接收者根据'指定的主题'来查询派遣给过自己的所有任务(相关信息)
		  *@参数:
		  *		[in] _rcvr 接收者
		  *		[in] _subj  任务主题
		  *@返回值:
		  *		任务全部信息的stdObj集合
		  *@备注:同时获取消息信息和指派信息
		  */
		 public function retriTaskByRcvrAndSubject($_rcvr, $_subj){
				$retSet = array();			//待返回的集合
				
				$sqlStr= "select meta.task_no, meta.creator, meta.create_date, meta.is_sent, meta.is_done,
									  meta.oth_reciver, meta.reciver_read, meta.subject, meta.comments, mets.reciver
									  from tb_memo_task as meta 
									  join tb_memo_taskassign as mets on meta.task_no=mets.task_no
									  where meta.subject like '%{$_subj}%' and mets.reciver='{$_rcvr}' 
									  order by meta.create_date asc";

				$dbTool = $this->t_dbTool;
				$dbTool->doCnnt();
				$res = $dbTool->exeDql($sqlStr);
				while($obj = mysql_fetch_object($res)){
						$retSet[] = $obj;
				}
				
				$dbTool->closeCnnt();
				return $retSet;
		 }//end func-retriTaskByRcvrAndSubject

		/*@功能:获取接收者在某一天之内接受到的任务
		  *@参数:
		  *		[in] _rcvr 接收者
		  *		[in] _date 给定的某天( YYYY-MM-DD )
		  *@返回值:
		  *		任务全部信息的stdObj集合
		  *@备注:同时获取消息信息和指派信息
		  */
		 public function retriTaskByRcvrAndDate($_rcvr, $_date){
				$retSet = array();			//待返回的集合
				$fromTime = strtotime($_date);
				$toTime = $fromTime + 24*3600;
				
				$sqlStr= "select meta.task_no, meta.creator, meta.create_date, meta.is_sent, meta.is_done,
								    meta.oth_reciver, meta.reciver_read, meta.subject, meta.comments, mets.reciver
									from tb_memo_task as meta 
									join tb_memo_taskassign as mets on meta.task_no=mets.task_no
								    where create_date>=".$fromTime." and create_date<".$toTime
									." and mets.reciver='{$_rcvr}' 
									order by meta.create_date asc";

				$dbTool = $this->t_dbTool;
				$dbTool->doCnnt();
				$res = $dbTool->exeDql($sqlStr);
				while($obj = mysql_fetch_object($res)){
						$retSet[] = $obj;
				}
				
				$dbTool->closeCnnt();
				return $retSet;
		 }//end func-retriTaskByRcvrAndDate
		
		/*@功能:根据taskNo获取对应消息的全部信息
		  *@参数:
		  *		[in] _taskNo待查询任务的任务编号
		  *@返回值:
		  *		返回任务集(纵然只有一个)
		  */
		 public function retriTaskByTaskNo($_taskNo){
				$retSet = array();			//待返回的集合
				
				$sqlStr= "select meta.task_no, meta.creator, meta.create_date, meta.is_sent, meta.is_done,
								    meta.oth_reciver, meta.reciver_read, meta.subject, meta.comments, mets.reciver
									from tb_memo_task as meta 
									join tb_memo_taskassign as mets on meta.task_no=mets.task_no
								    where meta.task_no='$_taskNo'";

				$dbTool = $this->t_dbTool;
				$dbTool->doCnnt();
				$res = $dbTool->exeDql($sqlStr);
				while($obj = mysql_fetch_object($res)){
						$retSet[] = $obj;
				}
				
				$dbTool->closeCnnt();
				return $retSet;
		 }//end func-retriTaskByTaskNo

		 /*@功能：检测创建者是否还能操作(收回)给定task_no的任务
		  *@参数：
		  *		[in] _taskNo 待收回的任务
		  *@返回值：
		  *		如果可以则返回 true
		  *		如果不可以则返回 false
		  *@用于"创建者"和"接收者"的操作冲突：创建者不能收回接收者已经完成的任务
		  */
		public function isCreatorCanContinue($_taskNo){
				$bRetVal = false;
				$sqlTpl = "select count(id) as num from %s where is_done=0 and is_sent=1 and task_no='%s'";
				$sqlStr = sprintf($sqlTpl, $this->m_tbName, $_taskNo);

				$dbTool = $this->t_dbTool;
				$dbTool->doCnnt();
				$res = $dbTool->exeDql($sqlStr);
				$obj =mysql_fetch_object($res);
				
				if(1 == $obj->num){
						$bRetVal = true;
				}

				$dbTool->closeCnnt();
				return $bRetVal;
		}//end func-isCreatorCanContinue

	    /*@功能：检测'接收者'是否还能操作(修改|完成|撤销完成)给定task_no的任务
		  *@参数：
		  *		[in] _taskNo 待收回的任务
		  *@返回值：
		  *		如果可以则返回 true
		  *		如果不可以则返回 false
		  *@用于"创建者"和"接收者"的操作冲突：接收者不能操作已经收回和删除的任务
		  */
		public function isReciverCanContinue($_taskNo){
				$bRetVal = false;
				$sqlTpl = "select count(id) as num from %s where is_sent=1 and task_no='%s'";
				$sqlStr = sprintf($sqlTpl, $this->m_tbName, $_taskNo);

				$dbTool = $this->t_dbTool;
				$dbTool->doCnnt();
				$res = $dbTool->exeDql($sqlStr);
				$obj =mysql_fetch_object($res);
				
				if(1 == $obj->num){
						$bRetVal = true;
				}

				$dbTool->closeCnnt();
				return $bRetVal;
		}//end func-isReciverCanContinue

		/*@功能:将m_tbName和t_dbTool以外的数据成员置为null
		  *@备注:为更新表项做准备
		  */
		 public function clear(){
				foreach($this as $attr => $value){
						if(  ("m_tbName" == $attr)	||  ("t_dbTool" == $attr) ){
								continue;
						}
						$this->$attr = null;
				}//foreach
		 }//end func-clear

		/*
		  *@功能:从对象属性，构建待更新的'数据表字段映射'
		  *@返回值:
		  *			null:		如果没有待更新的字段
		  *			ary:		待更新的数据表字段  => 值 映射
		  */
		 public function _buildUpdtFieldMap(){
				$fieldsMap = array();

				foreach($this as $attr => $value){
						if(  ("m_tbName" == $attr)	||  ("t_dbTool" == $attr) ){
								continue;
						}
						if( !empty($value) ){
								$fieldName = self::$s_fieldsMap[$attr];
								$fieldsMap[$fieldName] = $value;
						}
				}//foreach
				
				if( 0 == count($fieldsMap) ){
						$fieldsMap = null;
				}

				return $fieldsMap;
		}//end func-_buildUpdtFieldMap
		
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