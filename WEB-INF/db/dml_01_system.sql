/*
	Group
*/

insert into _group (name, type) values ('Administrator', 0);	-- 1

/*
	User
	Password: hash of sha256
*/

insert into _user (name, realname, password) values ('root', 'Administrator', '3f38a07b0dc3ee666018ffb423e2e7d117b40cf51a7ae97cc9f68b3940fe01fb');	-- 1

/*
	User -> Group
*/

insert into _user_group (_user_id, _group_id) values (1, 1);

/*
	Menu
*/

insert into _menu (id, pid, type, label, icon, image, module, description) values (1		,0		,0	,'Home'			,'home'			,''				,'MainHome'			,'');
insert into _menu (id, pid, type, label, icon, image, module, description) values (2		,0		,0	,'Dashboard'	,'dashboard'	,''				,'MainDashboard'	,'');
insert into _menu (id, pid, type, label, icon, image, module, description) values (3		,0		,0	,'System'		,'sys'			,''				,'System'			,'');
insert into _menu (id, pid, type, label, icon, image, module, description) values (4		,3		,1	,'User'			,'user'			,''				,'SystemUser'		,'');
insert into _menu (id, pid, type, label, icon, image, module, description) values (5		,3		,1	,'Group'		,'group'		,''				,'SystemGroup'		,'');
insert into _menu (id, pid, type, label, icon, image, module, description) values (6		,3		,1	,'Menu Access'	,'menu'			,''				,'SystemMenu'		,'');
insert into _menu (id, pid, type, label, icon, image, module, description) values (101		,1		,2	,'User'			,'user'			,'home_user'	,'SystemUser'		,'System user');

/*
	Group -> Menu
*/

insert into _group_menu (_group_id, _menu_id, permission) values (1		,1		,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,2		,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,3		,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,4		,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,5		,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,6		,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,101	,4);
