/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

/*
	Default profile.
 */
insert into _profile (id, _user_id, name) values (1, 1, "Jaring");

/*
	User
	Password: hash of sha256
*/
insert into
_user	(_profile_id	,id	,name		,realname			,password)
values	(1				,1	,'admin'	,'Administrator'	,'8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');

/*
	Group
*/
insert into
_group (_profile_id	,id	,pid	,name				,type)
values (1			,1	,0		,'Administrator'	,0);

/*
	User -> Group
*/
insert into _user_group (id, _user_id, _group_id) values (1, 1, 1);

/*
	Menu
*/
insert into _menu
(_profile_id, id	,pid	,type	,label	,icon	,image	,module		, description)
values
	(1	,1		,0		,0	,''					,'home'			,''						,'main_home'			,'')
,	(1	,2		,0		,0	,'Dashboard'		,'dashboard'	,''						,'main_dashboard'		,'')
,	(1	,1000	,0		,0	,'System'			,'sys'			,''						,'System'				,'')
,	(1	,1001	,1000	,3	,'User'				,'user'			,'icons/user.svg'		,'System_User'			,'')
,	(1	,1002	,1000	,3	,'Group'			,'group'		,'icons/group.svg'		,'System_Group'			,'')
,	(1	,1003	,1000	,0	,'User Group'		,'user'			,''						,'System_Group_User'	,'')
,	(1	,1004	,1000	,0	,'User Non Group'	,'user'			,''						,'System_Group_UserNon'	,'')
,	(1	,1005	,1000	,3	,'Menu Access'		,'menu_access'	,'icons/menu_access.svg','System_Menu_Access'	,'')
,	(1	,1006	,1000	,3	,'Menu'				,'menu'			,'icons/menu.svg'		,'System_Menu'			,'')
,	(1	,1007	,1000	,3	,'Media'			,'media'		,'icons/media.svg'		,'System_Media'			,'')
,	(1	,1008	,1000	,0	,'Media Table'		,'media'		,'icons/media.svg'		,'System_Media_Table'	,'')
,	(1	,1009	,1000	,3	,'Profile'			,'profile'		,'icons/profile.svg'	,'System_Profile'		,'');
,	(1	,1010	,1000	,0	,'Profile User'		,'user'			,'icons/user.svg'		,'System_Profile_User'	,'');

/*
	Group -> Menu
*/
insert into _group_menu (_group_id, _menu_id, permission)
values
	(1	,1		,4)
,	(1	,2		,4)
,	(1	,1000	,4)
,	(1	,1001	,4)
,	(1	,1002	,4)
,	(1	,1003	,4)
,	(1	,1004	,4)
,	(1	,1005	,4)
,	(1	,1006	,4)
,	(1	,1007	,4)
,	(1	,1008	,4)
,	(1	,1009	,4);
,	(1	,1010	,4);
