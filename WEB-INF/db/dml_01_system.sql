/*
	Group
*/

insert into jaring._group (name, type) values ('Administrator', 0);	-- 1

/*
	User
	Password: hash of sha256
*/

insert into jaring._user (name, realname, password) values ('root', 'Administrator', '3f38a07b0dc3ee666018ffb423e2e7d117b40cf51a7ae97cc9f68b3940fe01fb');	-- 1

/*
	User -> Group
*/

insert into jaring._user_group (_user_id, _group_id) values (1, 1);

/*
	Menu
*/

insert into jaring._menu (id, pid, type, label, icon, image, module, description) values (1		,0		,0	,''			,'home'			,''				,'MainHome'			,'');
insert into jaring._menu (id, pid, type, label, icon, image, module, description) values (2		,0		,0	,'Dashboard'	,'dashboard'	,''				,'MainDashboard'	,'');
insert into jaring._menu (id, pid, type, label, icon, image, module, description) values (1000		,0		,0	,'System'		,'sys'			,''				,'System'			,'');
insert into jaring._menu (id, pid, type, label, icon, image, module, description) values (1001		,1000	,1	,'User'			,'user'			,''				,'System_User'		,'');
insert into jaring._menu (id, pid, type, label, icon, image, module, description) values (1002		,1000	,1	,'Group'		,'group'		,''				,'System_Group'		,'');
insert into jaring._menu (id, pid, type, label, icon, image, module, description) values (1003		,1000	,1	,'Menu Access'	,'menu'			,''				,'System_Menu'		,'');

/*
	Group -> Menu
*/

insert into jaring._group_menu (_group_id, _menu_id, permission) values (1		,1		,4);
insert into jaring._group_menu (_group_id, _menu_id, permission) values (1		,2		,4);
insert into jaring._group_menu (_group_id, _menu_id, permission) values (1		,1000	,4);
insert into jaring._group_menu (_group_id, _menu_id, permission) values (1		,1001	,4);
insert into jaring._group_menu (_group_id, _menu_id, permission) values (1		,1002	,4);
insert into jaring._group_menu (_group_id, _menu_id, permission) values (1		,1003	,4);
