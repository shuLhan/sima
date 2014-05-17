create table _group
(
	id			integer			primary key
,	pid			integer			default 0
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
