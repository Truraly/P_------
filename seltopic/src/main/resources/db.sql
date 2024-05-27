create database seltopic if not exists;

use seltopic;

create table student(
    s_no varchar(10),
    s_name varchar (20),
    s_pwd varchar (20),
    s_subject varchar (100)
);


insert into student values('0001','stu1','123456','s1');
insert into student values('0002','stu2','123456','s2');
insert into student values('0003','stu3','123456','s3');

-- drop database seltopic;


create table teacher(
    t_no varchar(10),
    t_name varchar (20),
    t_pwd varchar (20)
);

insert into teacher values('0001','tea1','123456');

create table topic(
    tc_no int primary  key auto_increment,
    tc_name varchar (100),
    tc_subject varchar (100),
    tc_stu_no varchar (10),
    tc_selected int
);

insert into topic values(null,'topic1','s1',null,0);
insert into topic values(null,'topic2','s2','0001',1);
insert into topic values(null,'topic3','s3',null,0);
insert into topic values(null,'topic4','s4','0003',1);
insert into topic values(null,'topic5','s5',null,0);
insert into topic values(null,'topic6','s6',null,0);
insert into topic values(null,'topic7','s7',null,0);
insert into topic values(null,'topic8','s8',null,0);
insert into topic values(null,'topic9','s9',null,0);


-- 学生登录
select  s_no,s_name,s_pwd,s_subject  from t_student where s_no = '0001' and s_pwd = '123456';
-- 教师登录
select t_no,t_name,t_pwd from t_teacher where t_no = '0001' and t_pwd = '123456';