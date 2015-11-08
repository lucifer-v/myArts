<?php
//MysqlHelper连接异常
class MysqlHelperException extends Exception {}
//MysqlHelper参数异常
class MysqlHelperParamException extends Exception {}

/**
*1. 抛出异常的职责，集中在_doQuery()中
*2. 将_doConnect()公有化(改为doConnet)，因为反序列化之后，$link会丢失
*
*/
class MysqlHelper{
	private $link;				//当前对象所建立的链接
	private $host;				//当前连接的服务器主机
	private $port;				//当前连接的服务器主机端口
	private $username;			//用户名
	private $password;			//密码
	private $dbname;			//待操作的数据库名
	private $charset;			//客户端字符集
	private $prefix;				//数据库表前缀
	
	/**
	*接受一个参数数组，构建一个MysqlHelper对象
	*
	*初始化MysqlHelper对象属性，建立连接(设置字符信息，选择数据库)
	*如果没有提供对应的参数，则使用默认参数
	*默认情况下：host="localhost", port=3306, username="root", password="root", dbname="mysql"
	*				charset = "utf8"
	*
	*@param array _cnntParams 连接参数数组信息
	*/
	public function __construct( $_cnntParams ){
		// 初始化属性
		$this->host = isset($_cnntParams['host']) ? $_cnntParams['host'] : 'localhost' ;
		$this->port = isset($_cnntParams['port']) ? $_cnntParams['port'] : 3306 ;
		$this->username = isset($_cnntParams['username']) ? $_cnntParams['username'] : 'root' ;
		$this->password = isset($_cnntParams['password']) ? $_cnntParams['password']: 'mysql';
		$this->dbname = isset($_cnntParams['dbname'])? $_cnntParams['dbname'] : 'mysql';
		$this->charset = isset($_cnntParams['charset'])? $_cnntParams['charset'] : 'utf8';
		$this->prefix = isset($_cnntParams['prefix'])? $_cnntParams['prefix'] : '';

		$this->doConnect();		//建立链接
	}//__construct
	
	/** 
	  *析构函数，关闭当前链接
	
	public function __destruct(){
		if( $this->link ){
			mysql_close($this->link);
		}
	}//__destruct  */

	/**
	 *执行通用的查询操作
	 *如果语句执行错误，那么抛出MysqlHelperException异常类
	 *
	 *@param string _sql 待执行的sql语句
	 *@return mixed 如果执行失败，返回false
	 *				 如果执行成功，返回ture或结果集
	 */
	 private function _doQuery( $_sql ){
		$retVal = mysql_query( $_sql );
		if( !$retVal ){	//如果执行失败，抛出异常
			throw new MysqlHelperException( mysql_errno(). "  ".mysql_error() );
		}
		return $retVal;
	 }//doQuery
	
	/**
	*通知服务器连接字符集
	*/
	private function _setCharset(){
		$sql = "set names {$this->charset}";
		$this->_doQuery( $sql );
	}//_setCharset

	/**
	*选择待操作的数据库
	*/
	private function _selectDb(){
		$sql = "use {$this->dbname}";
		$this->_doQuery( $sql );
	}//_selectDb

	/**
	 *建立链接，设置link属性
	 *
	 *连接失败，则抛出MysqlHelper异常
	 *
	 *@return  如果成功，返回链接资源
	 */
	 public function doConnect(){
		@$this->link = mysql_connect("{$this->host}:{$this->port}", $this->username, $this->password);
		if( !$this->link ){		//建立链接失败
			throw new MysqlHelperException( mysql_errno() . "  " . mysql_error() );
		}

		$this->_setCharset();	//设置字符集信息
		$this->_selectDb();		//选择数据库
	 }//_doConnect
	
	/**
	 *增加一条记录，如果同时添加多条记录，那么返回的是
	 *插入第一条记录时的auto_increment id
	 *
	 *@param string _sql 待执行的sql语句
	 *@return int 如果执行成功返回插入的自增长id
	 *			   如果执行失败，则抛出异常
	 */
	public function insert( $_sql ){
		$this->_doQuery( $_sql );
		return mysql_insert_id($this->link);
	}//insert

	/**
	 *执行删除,或更新操作
	 *
	 *@param string _sql 待执行的sql语句
	 *@return int 如果执行成功，返回受影响的
	 */
	public function execDml( $_sql ){
		$this->_doQuery( $_sql );
		return mysql_affected_rows($this->link);
	}//execDml

	/**
	 *返回结果集的左顶角值
         *
	 *通常用于获取惟一的组函数统计值
	 *
	 *@param string _sql 待执行的sql语句
	 *@return mixed 如果查询无果，返回NULL (需要 === 判断，区别0)
	 *			返回查询结果集中的左顶角值
	 */
	 public function getTopLeftVal( $_sql ){
		$res = $this->_doQuery( $_sql );
		$row = mysql_fetch_array($res);
		return $row[0] ;
	 }//getTopLeftVal
	
	/**
	 *获取一条记录
	 *
	 *@param string _sql 待执行的sql语句
	 *@return mix 如果查询无果，返回数组
	 *			     否则，返回该行数据
	 */
	 public function retrieveOne( $_sql ){
		$res = $this->_doQuery( $_sql );
		$row = mysql_fetch_assoc($res);

		return ( false === $row) ? array() : $row ;
	 }//retrieveOne
	
	/**
	 *获取记录集合
	 *
	 *@param string _sql 待执行的sql语句
	 *@return 如果集合为空，返回空数组
	 *		     否则，返回二维数组集
	 */
	public function retrieveAll( $_sql ){
		$res = $this->_doQuery( $_sql );

		$retAssoc = array();		//组织数组
		while( $row = mysql_fetch_assoc($res) ){
			$retAssoc[] = $row;
		}//while

		return $retAssoc;
	}//retrieveAll
	
	/** 获得表前缀 **/
	public function getPrefix(){
		return $this->prefix;
	}//getPrefix

	/** 获得数据库名字 **/
	public function getDbName(){
		return $this->dbname;
	}//getDbName
}//class