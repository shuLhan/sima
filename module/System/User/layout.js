/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

Ext.define ("Jx.app.System.User", {
	extend	:"Jx.GridPaging.FormEditor"
,	config	:
	{
		itemId		:"System_User"
	,	title		:"System User"
	,	store		: Ext.create ("Jx.StoreRest",
		{
			url		:Jx.generateModDir ("System_User")
		,	fields	:
			[
				"_profile_id"
			,	"id"
			,	"name"
			,	"realname"
			,	"password"
			,	"password_old"
			]
		})
	,	columns		:
		[{
			header		:"Profile ID"
		,	dataIndex	:"_profile_id"
		,	hidden		:true
		,	editor		:
			{
				hidden		:true
			}
		},{
			header		:"ID"
		,	dataIndex	:"id"
		,	hidden		:true
		,	editor		:
			{
				hidden		:true
			}
		},{
			header		:"User ID"
		,	dataIndex	:"name"
		,	flex		:1
		,	editor		:
			{
				vtype		:"alphanum"
			,	allowBlank	:false
			}
		},{
			header		:"User name"
		,	dataIndex	:"realname"
		,	flex		:1
		,	editor		:
			{
				allowBlank	:false
			}
		},{
			header		:"Current Password"
		,	dataIndex	:"password_old"
		,	hidden		:true
		},{
			header		:"Password"
		,	dataIndex	:"password"
		,	hidden		:true
		,	editor		:
			{
				vtype		:"alphanum"
			,	inputType	:"password"
			}
		}]
	}
});

var System_User = Ext.create ("Jx.app.System.User");

//# sourceURL=module/System/User/layout.js
