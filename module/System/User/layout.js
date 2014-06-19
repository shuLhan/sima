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
	,	panelConfig	:
		{
			title		:"System User"
		,	closable	:true
		}
	,	columns		:
		[{
			header		:"ID"
		,	dataIndex	:"id"
		,	hidden		:true
		,	editor		:
			{
				xtype		:"textfield"
			,	hidden		:true
			}
		},{
			header		:"User ID"
		,	dataIndex	:"name"
		,	flex		:1
		,	editor		:
			{
				xtype		:"textfield"
			,	vtype		:"alphanum"
			,	allowBlank	:false
			}
		},{
			header		:"User name"
		,	dataIndex	:"realname"
		,	flex		:1
		,	editor		:
			{
				xtype		:"textfield"
			,	allowBlank	:false
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
				xtype		:"textfield"
			,	vtype		:"alphanum"
			,	inputType	:"password"
			}
		}]
	}

,	constructor : function (config)
	{
		var opts	= {};
		var dir		= Jx.generateModDir (this.config.itemId);
		var store	= Ext.create ("Jx.StoreRest", {
				url		:dir
			,	fields	:
				[
					"id"
				,	"name"
				,	"realname"
				,	"password"
				,	"password_old"
				]
			});

		Ext.merge (opts, {
				store	: store
			});
		Ext.merge (opts, this.config);

		this.callParent ([opts]);
	}
});

var System_User = Ext.create ("Jx.app.System.User");

//# sourceURL=module/System/User/layout.js
