/*
	Common tables for system application.
	Please keep DDL in this script vendor agnostic.
*/

/*
	Group of user.

	Group.type:
	- 0 : system group, can't be deleted
	- 1 : user group.
 */
create sequence	_group_seq;

create table _group
(
	id			integer			not null default nextval ('_group_seq')
,	name		varchar (128)	not null
,	type		integer			default 1
,	constraint	_group_pk		primary key (id)
);

/*
	User of application.
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
	User -> Group
*/
create sequence _user_group_seq;

create table _user_group
(
	id			integer			not null default nextval ('_user_group_seq')
,	_user_id	integer			not null
,	_group_id	integer			not null
,	constraint	_user_group_pk		primary key (id)
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
