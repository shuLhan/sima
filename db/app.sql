insert into _menu (
		id	,pid	,type	,label			,icon	,image	,module			,description
) values (
		10	,0		,0		,'Referensi'	,'ref'	,''		,'Reference'	,''
);

insert into _menu (
		id	,pid	,type	,label			,icon	,image	,module					,description
) values (
		11	,10		,3		,'Tipe Aset'	,'ref'	,'../icons/reference.svg'		,'Reference_Asset_Type'	,''
);

insert into _menu (
		id	,pid	,type	,label				,icon	,image	,module							,description
) values (
		12	,10		,3		,'Pengadaan Aset'	,'ref'	,'../icons/reference.svg'		,'Reference_Asset_Procurement'	,''
);

insert into _menu (
		id	,pid	,type	,label				,icon	,image	,module							,description
) values (
		13	,10		,3		,'Status Aset'		,'ref'	,'../icons/reference.svg'		,'Reference_Asset_Status'		,''
);

insert into _menu (
		id	,pid	,type	,label				,icon	,image	,module							,description
) values (
		14	,10		,3		,'Lokasi Aset'		,'ref'	,'../icons/reference.svg'		,'Reference_Asset_Location'		,''
);

insert into _group_menu (_group_id, _menu_id, permission) values (1	,10	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,11	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,12	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,13	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,14	,4);

insert into _menu (
		id	,pid	,type	,label				,icon	,image	,module							,description
) values (
		20	,0		,0		,'Aset'				,'asset'	,''		,'Asset'						,''
);

insert into _menu (
		id	,pid	,type	,label				,icon		,image					,module		,description
) values (
		21	,20		,3		,'Aset'				,'asset'	,'../icons/asset.svg'	,'Asset'	,''
);

insert into _menu (
		id	,pid	,type	,label				,icon		,image					,module				,description
) values (
		22	,20		,3		,'Barcode'			,'barcode'	,'../icons/barcode.svg'	,'Asset_Barcode'	,''
);

insert into _menu (
	id	,pid	,type	,label			,icon		,image						,module			,description
) values (
	23	,20		,3		,'Relokasi'		,'assign'	,'../app/Asset/assign.svg'	,'Asset_Assign'	,''
);

insert into _group_menu (_group_id, _menu_id, permission) values (1	,20	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,21	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,22	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,23	,4);

create table asset_type
(
	id		integer			not null
,	name	varchar(128)	not null
,	constraint asset_type_pk primary key (id)
);

create table asset_procurement
(
	id		integer			not null
,	name	varchar(128)	not null
,	constraint asset_procurement_pk	primary key (id)
);

create table asset_status
(
	id		integer			not null
,	name	varchar(128)	not null
,	constraint asset_status_pk primary key (id)
);

create table asset_location
(
	id		integer			not null
,	name	varchar(128)	not null
,	constraint asset_location_pk primary key (id)
);

create table asset
(
	id					integer			not null
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

,	status_id			integer			null
,	_user_id			integer			null
,	location_id			integer			null
,	location_detail		varchar(255)	default ''
,	maintenance_info	varchar(255)	default ''

,	table_id			varchar(32)		default null

,	constraint asset_pk	primary key (id)
);

/*
	Log of all asset assignment
 */
create table asset_assign_log
(
	asset_id		integer			not null
,	cost			numeric(15,2)	default 0.00
,	assign_date		date			null
,	_user_id		integer			null
,	location_id		integer			null
,	location_detail	varchar(1024)	default ''
,	description		varchar(1024)	default ''
,	constraint asset_assign_log_fk_01 foreign key (asset_id)	references asset (id)
);
