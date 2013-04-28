/*
	Common tables for system application.
	Please keep DDL in this script vendor agnostic.
*/
/*
	User of application

	_user.password encrypted with function sha256 (salt + real-password).
*/
create sequence _user_seq;

create table _user
(
	id			integer			not null default nextval ('_user_seq')
,	name		varchar (32)	not null
,	realname	varchar (128)	not null
,	password	varchar (256)	not null
,	constraint	_user_pk		primary key (id)
);

/*
	Group of user
*/
create sequence	_group_seq;

create table _group
(
	id			integer			not null default nextval ('_group_seq')
,	name		varchar (128)	not null
,	constraint	_group_pk		primary key (id)
);

/*
	User -> Group
*/
create table _user_group
(
	_user_id	integer			not null
,	_group_id	integer			not null
,	constraint	_user_group_pk		primary key (_user_id, _group_id)
,	constraint	_user_group_fk_01	foreign key (_user_id)	references _user (id)
,	constraint	_user_group_fk_02	foreign key (_group_id)	references _group (id)
);

/*
	Menu
*/
create table _menu
(
	id			integer			not null
,	pid			integer			not null
,	label		varchar (64)	default ''
,	icon		varchar (32)	default ''
,	module		varchar (128)	default ''
,	constraint	_menu_pk		primary key (id)
);

/*
	Group -> Menu

	_group_menu.permission value,
		0: no access
		1: view
		2: insert
		3: update
		4: delete
*/
create table _group_menu
(
	_group_id	integer			not null
,	_menu_id	integer			not null
,	permission	integer			not null default 0
,	constraint	_group_menu_pk		primary key (_group_id, _menu_id)
,	constraint	_group_menu_fk_01	foreign key (_group_id)	references _group (id)
,	constraint	_group_menu_fk_02	foreign key (_menu_id)	references _menu (id)
);
