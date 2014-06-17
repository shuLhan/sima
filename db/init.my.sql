create database jaring;

create user 'jaring'@'localhost' identified by 'jaring';

grant all on jaring.* to 'jaring'@'localhost';

/*
drop table	jaring._group_menu;
drop table	jaring._menu;
drop table	jaring._user_group;
drop table	jaring._group;
drop table	jaring._user;
*/

/*
	Group of user.

	Group.type:
	- 0 : system group, can't be deleted
	- 1 : user group.
 */
create table jaring._group
(
	id			integer			not null AUTO_INCREMENT
,	pid			integer			default 0
,	name		varchar (128)	not null
,	type		integer			default 1
,	constraint	_group_pk		primary key (id)
);

/*
	User of application.
	_user.password encrypted with function sha256 (salt + real-password).
*/
create table jaring._user
(
	id			integer			not null AUTO_INCREMENT
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
create table jaring._user_group
(
	id			integer			not null AUTO_INCREMENT
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
create table jaring._media
(
	id			integer			not null AUTO_INCREMENT
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
create table jaring._media_table
(
	table_id	varchar(32)		not null
,	_media_id	integer			not null
);

/*
	Application tables.
 */
create table asset_type
(
	id		integer			not null	AUTO_INCREMENT
,	name	varchar(128)	not null
,	constraint asset_type_pk primary key (id)
);

insert into asset_type (id, name) values (0, '-');

create table asset_procurement
(
	id		integer			not null	AUTO_INCREMENT
,	name	varchar(128)	not null
,	constraint asset_procurement_pk	primary key (id)
);

insert into asset_procurement (id, name) values (0, "-");

create table asset_status
(
	id		integer			not null	AUTO_INCREMENT
,	name	varchar(128)	not null
,	constraint asset_status_pk primary key (id)
);

insert into asset_status (id, name) values (0, "-");

create table asset_location
(
	id		integer			not null	AUTO_INCREMENT
,	name	varchar(128)	not null
,	constraint asset_location_pk primary key (id)
);

insert into asset_location (id, name) values (0, "-");

create table asset_removal
(
	id		integer			not null	AUTO_INCREMENT
,	name	varchar(128)	not null
,	constraint asset_removal_pk primary key (id)
);

create table asset
(
	id					integer			not null	AUTO_INCREMENT
,	type_id				integer			not null
,	merk				varchar(255)	default ''
,	model				varchar(255)	default ''
,	sn					varchar(255)	default ''
,	barcode				varchar(255)	default ''
,	service_tag			varchar(255)	default ''
,	label				varchar(255)	default ''
,	detail				varchar(255)	default ''

,	warranty_date		date			null
,	warranty_length		integer			default 0
,	warranty_info		varchar(255)	default ''

,	procurement_id		integer			null
,	company				varchar(255)	default ''
,	price				float			default 0

,	table_id			varchar(32)		default null

,	status				smallint		default 1

,	constraint asset_pk	primary key (id)
);

/*
	Log of all asset assignment
 */
create table asset_assign_log
(
	id				integer			not null AUTO_INCREMENT
,	asset_id		integer			not null
,	cost			numeric(15,2)	default 0.00
,	assign_date		date			null
,	_user_id		integer			null
,	location_id		integer			null
,	location_detail	varchar(1024)	default ''
,	description		varchar(1024)	default ''

,	constraint asset_assign_log_pk		primary key (id)
,	constraint asset_assign_log_fk_01	foreign key (asset_id)	references asset (id)
);

/*
	Log of all asset maintenance.
 */
create table asset_maintenance_log
(
	id					integer			not null AUTO_INCREMENT
,	asset_id			integer			not null
,	asset_status_id		integer			null
,	cost				numeric(15,2)	default 0.00
,	maintenance_date	date			null
,	maintenance_info	varchar(1024)	default ''

,	constraint asset_maintenance_log_pk		primary key (id)
,	constraint asset_maintenance_log_fk_01	foreign key (asset_id) references asset (id)
);

create table asset_removal_log
(
	asset_id			integer			not null
,	asset_removal_id	integer			not null
,	removal_date		timestamp		default current_timestamp
,	removal_cost		numeric(15,2)	default 0.00
,	removal_info		varchar(1024)	default ''

,	constraint asset_removal_log_pk		primary key (asset_id)
,	constraint asset_removal_log_fk_01	foreign key (asset_id) references asset (id)
);
