create user jaring password 'jaring';

create database jaring owner jaring;

/*
drop table	jaring._group_menu;
drop table	jaring._menu;
drop table	jaring._user_group;
drop table	jaring._group;
drop table	jaring._user;

drop sequence	jaring._user_group_seq;
drop sequence	jaring._group_seq;
drop sequence	jaring._user_seq;
*/

/*
	Group of user.

	Group.type:
	- 0 : system group, can't be deleted
	- 1 : user group.
 */
create sequence	jaring._group_seq;

create table jaring._group
(
	id			integer			not null default nextval ('_group_seq')
,	pid			integer			default 0
,	name		varchar (128)	not null
,	type		integer			default 1
,	constraint	_group_pk		primary key (id)
);

/*
	User of application.
	_user.password encrypted with function sha256 (salt + real-password).
*/
create sequence jaring._user_seq;

create table jaring._user
(
	id			integer			not null default nextval ('_user_seq')
,	name		varchar (32)	not null
,	realname	varchar (128)	not null
,	password	varchar (256)	not null
,	status		int				default 1
,	last_login	timestamp		default current_timestamp
,	constraint	_user_pk		primary key (id)
);

/*
	User -> Group
*/
create sequence jaring._user_group_seq;

create table jaring._user_group
(
	id			integer			not null default nextval ('_user_group_seq')
,	_user_id	integer			not null
,	_group_id	integer			not null
,	constraint	_user_group_pk		primary key (id)
,	constraint	_user_group_fk_01	foreign key (_user_id)	references jaring._user (id)
,	constraint	_user_group_fk_02	foreign key (_group_id)	references jaring._group (id)
);

/*
	Menu

	_menu.type
		0: not active.
		1: menu will displayed in tab toolbar.
		2: menu will displayed in tab screen.
		3: menu will displayed in tab toolbar and screen.
*/
create table jaring._menu
(
	id			integer			not null
,	pid			integer			not null
,	type		integer			default 1
,	label		varchar (64)	default ''
,	icon		varchar (32)	default ''
,	image		varchar (256)	default ''
,	module		varchar (128)	default ''
,	description	varchar (128)	default ''
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
create table jaring._group_menu
(
	_group_id	integer			not null
,	_menu_id	integer			not null
,	permission	integer			not null default 0
,	constraint	_group_menu_pk		primary key (_group_id, _menu_id)
,	constraint	_group_menu_fk_01	foreign key (_group_id)	references jaring._group (id)
,	constraint	_group_menu_fk_02	foreign key (_menu_id)	references jaring._menu (id)
);

/*
 * All file saved in here.
 */
create sequence jaring._media_seq;

create table jaring._media
(
	id			integer			not null default nextval ('_media_seq')
,	name		varchar (128)	default ''
,	extension	varchar (5)		default ''
,	size		integer			default 0
,	mime		varchar (128)	default ''
,	description	varchar (255)	default ''
,	path		varchar (1024)	not null
,	constraint	_media_pk		primary key (id)
);

/*
 * What table and id use the content in _media.
 */
create table jaring._media_table
(
	table_id	varchar(32)		not null
,	_media_id	integer			not null
);

/*
	Identity of user/company that use the application.
 */
create table _profile
(
	name		varchar(64)		default ''
,	address		varchar(512)	default ''
,	phone_1		varchar(64)		default ''
,	phone_2		varchar(64)		default ''
,	phone_3		varchar(64)		default ''
,	fax			varchar(64)		default ''
,	email		varchar(64)		default ''
,	website		varchar(64)		default ''
,	logo_type	varchar(256)	default ''
,	logo		blob
);
