-- drop table _group_menu;
-- drop table _menu;
-- drop table _user_group;
-- drop table _group;
-- drop table _user;
-- drop table _media_table;
-- drop table _media;
-- drop table _profile;

/*
	Group of user.

	Group.type:
	- 0 : system group, can't be deleted
	- 1 : user group.
 */
create table _group
(
	id			bigint 			not null
,	pid			bigint			default 0
,	name		varchar (128)	not null
,	type		integer			default 1
,	constraint	_group_pk		primary key (id)
);

/*
	User of application.
	_user.password encrypted with function sha256 (salt + real-password).
*/
create table _user
(
	id			bigint 			not null
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
create table _user_group
(
	id			bigint	not null
,	_user_id	bigint 	not null
,	_group_id	bigint  not null
,	constraint	_user_group_pk		primary key (id)
,	constraint	_user_group_fk_01	foreign key (_user_id)	references _user (id)
,	constraint	_user_group_fk_02	foreign key (_group_id)	references _group (id)
);

/*
	Menu

	_menu.type
		0: not active.
		1: menu will displayed in tab toolbar.
		2: menu will displayed in tab screen.
		3: menu will displayed in tab toolbar and screen.
*/
create table _menu
(
	id			integer			not null
,	pid			integer			not null
,	type		integer			default 1
,	label		varchar (64)	default ''
,	icon		varchar (32)	default ''
,	image		varchar (32)	default ''
,	module		varchar (256)	default ''
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
create table _group_menu
(
	_group_id	bigint 			not null
,	_menu_id	integer			not null
,	permission	integer			not null default 0
,	constraint	_group_menu_pk		primary key (_group_id, _menu_id)
,	constraint	_group_menu_fk_01	foreign key (_group_id)	references _group (id)
,	constraint	_group_menu_fk_02	foreign key (_menu_id)	references _menu (id)
);

/*
 * All file saved in here.
 */
create table _media
(
	id			bigint 			not null
,	name		varchar (128)	default ''
,	extension	varchar (5)		default ''
,	size		integer			default 0
,	mime		varchar (128)	default ''
,	description	varchar (255)	default ''
,	path		varchar (1024)	not null
,	constraint	_media_pk primary key (id)
);

/*
 * What table and id use the content in _media.
 */
create table _media_table
(
	table_id	varchar (32)	not null
,	_media_id	bigint 			not null

,	constraint _media_table_pk primary key (table_id, _media_id)
);

/*
	Identity of user/company that use the application.
 */
create table _profile
(
	id			bigint			default 1
,	name		varchar (64)	default ''
,	address		varchar (512)	default ''
,	phone_1		varchar (64)	default ''
,	phone_2		varchar (64)	default ''
,	phone_3		varchar (64)	default ''
,	fax			varchar (64)	default ''
,	email		varchar (64)	default ''
,	website		varchar (64)	default ''
,	logo_type	varchar (256)	default ''
,	logo		blob
);
