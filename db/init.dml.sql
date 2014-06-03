/*
	Group
*/

insert into _group (id, pid, name, type) values (1, 0, 'Administrator', 0);	-- 1

/*
	User
	Password: hash of sha256
*/

insert into _user (name, realname, password) values ('admin', 'Administrator', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');	-- 1

/*
	User -> Group
*/

insert into _user_group (_user_id, _group_id) values (1, 1);

/*
	Menu
*/

insert into _menu (id, pid, type, label, icon, image, module, description)
values (1		,0		,0	,''					,'home'			,''						,'main_home'			,'');
insert into _menu (id, pid, type, label, icon, image, module, description)
values (2		,0		,0	,'Dashboard'		,'dashboard'	,''						,'main_dashboard'		,'');
insert into _menu (id, pid, type, label, icon, image, module, description)
values (1000	,0		,0	,'System'			,'sys'			,''						,'System'				,'');
insert into _menu (id, pid, type, label, icon, image, module, description)
values (1001	,1000	,3	,'User'				,'user'			,'../icons/user.svg'	,'System_User'			,'');
insert into _menu (id, pid, type, label, icon, image, module, description)
values (1002	,1000	,3	,'Group'			,'group'		,'../icons/group.svg'	,'System_Group'			,'');
insert into _menu (id, pid, type, label, icon, image, module, description)
values (1003	,1000	,0	,'User Group'		,'user'				,''						,'System_Group_User'	,'');
insert into _menu (id, pid, type, label, icon, image, module, description)
values (1004	,1000	,0	,'User Non Group'	,'user'			,''						,'System_Group_UserNon'	,'');
insert into _menu (id, pid, type, label, icon, image, module, description)
values (1005	,1000	,3	,'Menu Access'		,'menu'			,'../icons/menu.svg'	,'System_Menu_Access'	,'');
insert into _menu (id, pid, type, label, icon, image, module, description)
values (1006	,1000	,3	,'Menu'				,'menu'			,'../icons/menu.svg'	,'System_Menu'			,'');
insert into _menu (id, pid, type, label, icon, image, module, description)
values (1007	,1000	,3	,'Media'			,'media'		,'../icons/media.svg'	,'System_Media'			,'');
insert into _menu (id, pid, type, label, icon, image, module, description)
values (1008	,1000	,0	,'Media Table'		,'media'		,'../icons/media.svg'	,'System_Media_Table'	,'');

/*
	Group -> Menu
*/
insert into _group_menu (_group_id, _menu_id, permission) values (1		,1		,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,2		,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,1000	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,1001	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,1002	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,1003	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,1004	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,1005	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,1006	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,1007	,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,1008	,4);
