-- drop table asset_removal_log;
-- drop table asset_maintenance_log;
-- drop table asset_assign_log;
-- drop table asset;
-- drop table asset_removal;
-- drop table asset_location;
-- drop table asset_status;
-- drop table asset_procurement;
-- drop table asset_type;

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

insert into _menu (
	id	,pid	,type	,label				,icon	,image						,module						,description
) values (
	15	,10		,3		,'Penghapusan Aset'	,'ref'	,'../icons/reference.svg'	,'Reference_Asset_Removal'	,''
);

insert into _group_menu (_group_id, _menu_id, permission) values (1	,10	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,11	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,12	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,13	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,14	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,15	,4);

insert into _menu (
	id	,pid	,type	,label			,icon		,image						,module		,description
) values (
	20	,0		,0		,'Aset'			,'asset'	,''							,'Asset'	,''
);

insert into _menu (
	id	,pid	,type	,label			,icon		,image						,module		,description
) values (
	21	,20		,3		,'Aset'			,'asset'	,'../app/Asset/asset.svg'	,'Asset'	,''
);

insert into _menu (
	id	,pid	,type	,label			,icon		,image						,module				,description
) values (
	22	,20		,3		,'Barcode'		,'barcode'	,'../app/Asset/barcode.svg'	,'Asset_Barcode'	,''
);

insert into _menu (
	id	,pid	,type	,label			,icon		,image						,module			,description
) values (
	23	,20		,3		,'Relokasi'		,'assign'	,'../app/Asset/assign.svg'	,'Asset_Assign'	,''
);

insert into _menu (
	id	,pid	,type	,label			,icon			,image							,module					,description
) values (
	24	,20		,3		,'Pemeliharaan'	,'maintenance'	,'../app/Asset/maintenance.svg'	,'Asset_Maintenance'	,''
);

insert into _menu (
	id	,pid	,type	,label			,icon			,image							,module				,description
) values (
	25	,20		,3		,'Penghapusan'	,'removal'		,'../app/Asset/removal.svg'		,'Asset_Removal'	,''
);

insert into _group_menu (_group_id, _menu_id, permission) values (1	,20	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,21	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,22	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,23	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,24	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,25	,4);

insert into _menu (
	id,	pid, type, label, icon, image, module, description
) values (
	30, 0, 0, 'Laporan', 'report', '../app/Report/report.svg', 'Report', ''
);

insert into _menu (
	id,	pid, type, label, icon, image, module, description
) values (
	31, 30, 3, 'Pengadaan', 'report', '../app/Report/report.svg', 'Report_Procurement', ''
);

insert into _menu (
	id,	pid, type, label, icon, image, module, description
) values (
	32, 30, 3, 'Penghapusan', 'report', '../app/Report/report.svg', 'Report_Disposal', ''
);

insert into _group_menu (_group_id, _menu_id, permission) values (1	,30	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,31	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,32	,4);

/*
	Application tables.
 */
create table asset_type
(
	id		bigint 			not null
,	name	varchar(128)	not null
,	constraint asset_type_pk primary key (id)
);

create table asset_procurement
(
	id		bigint 			not null
,	name	varchar(128)	not null
,	constraint asset_procurement_pk	primary key (id)
);

create table asset_status
(
	id		bigint 			not null
,	name	varchar(128)	not null
,	constraint asset_status_pk primary key (id)
);

create table asset_location
(
	id		bigint 			not null
,	name	varchar(128)	not null
,	constraint asset_location_pk primary key (id)
);

create table asset_removal
(
	id		bigint 			not null
,	name	varchar(128)	not null
,	constraint asset_removal_pk primary key (id)
);

create table asset
(
	id					bigint 			not null
,	type_id				bigint 			not null
,	merk				varchar(255)	default ''
,	model				varchar(255)	default ''
,	sn					varchar(255)	default ''
,	barcode				varchar(255)	default ''
,	service_tag			varchar(255)	default ''
,	label				varchar(255)	default ''
,	detail				varchar(255)	default ''

,	warranty_length		integer			default 0
,	warranty_info		varchar(255)	default ''

,	procurement_id		bigint 			default 0
,	procurement_date	date			null
,	procurement_company	varchar(255)	default ''
,	procurement_price	float			default 0

,	table_id			varchar(32)		default null

,	status				smallint		default 1

,	constraint asset_pk	primary key (id)
);

/*
	Log of all asset assignment
 */
create table asset_assign_log
(
	id				bigint 			not null
,	asset_id		bigint 			not null
,	cost			numeric(15,2)	default 0.00
,	assign_date		date			null
,	_user_id		bigint 			null
,	location_id		bigint 			default 0
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
	id					bigint 			not null
,	asset_id			bigint 			not null
,	asset_status_id		bigint 			default 0
,	cost				numeric(15,2)	default 0.00
,	maintenance_date	date			null
,	maintenance_info	varchar(1024)	default ''

,	constraint asset_maintenance_log_pk		primary key (id)
,	constraint asset_maintenance_log_fk_01	foreign key (asset_id) references asset (id)
);

create table asset_removal_log
(
	asset_id			bigint 			not null
,	asset_removal_id	bigint 			default 0
,	removal_date		timestamp		default current_timestamp
,	removal_cost		numeric(15,2)	default 0.00
,	removal_info		varchar(1024)	default ''

,	constraint asset_removal_log_pk		primary key (asset_id)
,	constraint asset_removal_log_fk_01	foreign key (asset_id) references asset (id)
);

insert into asset_type (id, name) values (0, '-');
insert into asset_type (id, name) values (1, "PC");
insert into asset_type (id, name) values (2, "Laptop");

insert into asset_procurement (id, name) values (0, "-");
insert into asset_procurement (id, name) values (1, "Pembelian");
insert into asset_procurement (id, name) values (2, "Hibah");

insert into asset_status (id, name) values (0, "-");
insert into asset_status (id, name) values (1, "Baik");
insert into asset_status (id, name) values (2, "Rusak");

insert into asset_location (id, name) values (0, "-");
insert into asset_location (id, name) values (1, "Kantor Pusat");

insert into asset_removal (id, name) values (0, "-");
insert into asset_removal (id, name) values (1, "Dimusnahkan");
insert into asset_removal (id, name) values (2, "Dijual");
