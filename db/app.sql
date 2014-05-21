insert into _menu (
		id	,pid	,type	,label			,icon	,image	,module			,description
) values (
		10	,0		,0		,'Referensi'	,'sys'	,''		,'Reference'	,''
);

insert into _menu (
		id	,pid	,type	,label			,icon	,image	,module					,description
) values (
		11	,10		,3		,'Tipe Aset'	,'sys'	,''		,'Reference_Asset_Type'	,''
);

insert into _menu (
		id	,pid	,type	,label				,icon	,image	,module							,description
) values (
		12	,10		,3		,'Pengadaan Aset'	,'sys'	,''		,'Reference_Asset_Procurement'	,''
);

insert into _group_menu (_group_id, _menu_id, permission) values (1	,10	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,11	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1	,12	,4);


create table asset_type
(
	id		integer			not null	primary key
,	name	varchar(128)	not null
);

create table asset_procurement
(
	id		integer			not null	primary key
,	name	varchar(128)
);
