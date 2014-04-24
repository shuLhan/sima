create table _group
(
	id			integer			primary key
,	name		varchar (128)	not null
,	type		integer			default 1
);

create table _user
(
	id			integer			primary key
,	name		varchar (32)	not null
,	realname	varchar (128)	not null
,	password	varchar (256)	not null
,	status		int				default 1
,	last_login	timestamp		default current_timestamp
);

create table _user_group
(
	id			integer				primary key
,	_user_id	integer				not null
,	_group_id	integer				not null
,	constraint	_user_group_fk_01	foreign key (_user_id)	references _user (id)
,	constraint	_user_group_fk_02	foreign key (_group_id)	references _group (id)
);

create table _menu
(
	id			integer			primary key
,	pid			integer			not null
,	type		integer			default 1
,	label		varchar (64)	default ''
,	icon		varchar (32)	default ''
,	image		varchar (32)	default ''
,	module		varchar (128)	default ''
,	description	varchar (128)	default ''
);

create table _group_menu
(
	_group_id	integer				not null
,	_menu_id	integer				not null
,	permission	integer				not null default 0
,	constraint	_group_menu_pk		primary key (_group_id, _menu_id)
,	constraint	_group_menu_fk_01	foreign key (_group_id)	references _group (id)
,	constraint	_group_menu_fk_02	foreign key (_menu_id)	references _menu (id)
);

insert into _group (name, type) values ('Administrator', 0);	-- 1

insert into _user (name, realname, password) values ('admin', 'Administrator', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');	-- 1

insert into _user_group (_user_id, _group_id) values (1, 1);

insert into _menu (id, pid, type, label, icon, image, module, description) values (1		,0		,0	,''				,'home'			,''				,'MainHome'			,'');
insert into _menu (id, pid, type, label, icon, image, module, description) values (2		,0		,0	,'Dashboard'	,'dashboard'	,''				,'MainDashboard'	,'');
insert into _menu (id, pid, type, label, icon, image, module, description) values (1000		,0		,0	,'System'		,'sys'			,''				,'System'			,'');
insert into _menu (id, pid, type, label, icon, image, module, description) values (1001		,1000	,3	,'User'			,'user'			,'../icons/user.svg'	,'System_User'		,'');
insert into _menu (id, pid, type, label, icon, image, module, description) values (1002		,1000	,3	,'Group'		,'group'		,'../icons/group.svg'	,'System_Group'		,'');
insert into _menu (id, pid, type, label, icon, image, module, description) values (1003		,1000	,3	,'Menu Access'	,'menu'			,'../icons/menu.svg'	,'System_Menu'		,'');

insert into _group_menu (_group_id, _menu_id, permission) values (1		,1		,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,2		,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,1000	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,1001	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,1002	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,1003	,4);
