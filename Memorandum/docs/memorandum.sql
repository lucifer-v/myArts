set character_set_database=utf8;
set character_set_server=utf8;
set names gbk;

drop database if exists memorandum;
create database memorandum;

use memorandum;

/*创建备忘录任务表*/
drop table if exists tb_memo_task;
create table tb_memo_task(
id int unsigned primary key auto_increment comment '逻辑id',
task_no varchar(32) not null comment '任务(项目编号) TAK_X',
seq_no int unsigned not null comment '任务序号,task_no的后缀部分',
creator  varchar(32) not null default '' comment '任务创建者',
create_date int unsigned not null default 0 comment '任务创建时间',
is_sent tinyint unsigned not null default 0 comment '任务是否被派遣',
is_done tinyint unsigned not null default 0 comment '任务是否已经完成',
oth_reciver varchar(32) not null default '' comment '被指派完成任务的人',
reciver_read tinyint unsigned not null default 0 comment '被指派者是否已经阅读了任务',
subject varchar(1024) default '' comment '主题',
comments varchar(1024) default '' comment '内容',
solver varchar(32) default '' comment '任务解决者',
solve_date int unsigned default 0 comment '任务解决时间',
lastmodify_date int unsigned default 0 comment '任务上次修改时间'
)engine=innodb character set=utf8;

/*插入任务*/
insert into tb_memo_task (task_no, seq_no, creator, create_date, is_sent, is_done, oth_reciver, reciver_read, 
subject, comments, solver, solve_date, lastmodify_date) values 
('TAK_1', 1, 'user1', 111, 0, 0, '', 0, '催款', '' , '',  0, 111);

/*创建备忘录任务指派表*/
drop table if exists tb_memo_taskassign;
create table tb_memo_taskassign(
id int unsigned primary key auto_increment comment '逻辑id',
task_no varchar(32) not null comment '任务编号',
reciver varchar(32) not null comment '任务接受者'
)engine=innodb character set=utf8;

/*创建管理员表*/
drop table if exists tb_admin;
create table tb_admin(
id int unsigned primary key auto_increment comment '逻辑id',
uname varchar(32) unique not null comment '用户名',
pwd varchar(32) not null default '123456' comment '密码',
groupid tinyint unsigned not null default 1 comment '组id'
)engine=innodb character set=utf8;

-- 插入管理员表
insert into tb_admin (uname, pwd, groupid) values 
('user1', md5('11111'), 1),
('user2', md5('22222'), 1),
('user3', md5('33333'), 1);

select * from tb_memo_task;
select * from tb_memo_taskassign;

delete from tb_memo_task;
delete from tb_memo_taskassign;