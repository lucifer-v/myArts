表设计
drop database if exists db_shorturl;
create database db_shorturl;
set names gbk;
use db_shorturl;

drop table if exists su_url;
create table su_url(
id int unsigned primary key auto_increment,
short_url char(6) unique not null,	-- 短网址
true_url char(255) unique not null,	-- 真实url
expires int unsigned not null default 0,	-- 过期时间
lastatime int unsigned not null default 0 -- 最后访问时间
);
