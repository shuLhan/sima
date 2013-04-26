/*
	User
	Password: hash of sha256
*/

insert into _user (name, password) values ('root', '3f38a07b0dc3ee666018ffb423e2e7d117b40cf51a7ae97cc9f68b3940fe01fb');	-- 1

/*
	Group
*/

insert into _group (name) values ('Administrator');	-- 1

/*
	User -> Group
*/

insert into _user_group (_user_id, _group_id) values (1, 1);

/*
	Menu
*/

insert into _menu (id, pid, label, icon, module) values (1		,0		,'System'		,'sys'		,'System');
insert into _menu (id, pid, label, icon, module) values (2		,1		,'User'			,'user'		,'SystemUser');
insert into _menu (id, pid, label, icon, module) values (3		,1		,'Group'		,'group'	,'SystemGroup');
insert into _menu (id, pid, label, icon, module) values (4		,1		,'Menu Access'	,'menu'		,'SystemMenu');

/*
	Group -> Menu
*/

insert into _group_menu (_group_id, _menu_id, permission) values (1		,1		,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,2		,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,3		,4);
insert into _group_menu (_group_id, _menu_id, permission) values (1		,4		,4);
