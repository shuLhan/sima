/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxSystemUser ()
{
	this.id		= "System_User";
	this.dir	= Jx.generateModDir (this.id);

	this.store	= Ext.create ("Jx.StorePaging", {
		url			:this.dir
	,	singleApi	:false
	,	fields		:
		[
			"id"
		,	"name"
		,	"realname"
		,	"password"
		,	"password_old"
		]
	});

	this.panel			= Ext.create ("Jx.GridPaging.FormEditor", {
			itemId		:this.id
		,	store		:this.store
		,	panelConfig	:
			{
				itemId		:this.id
			,	title		:"System User"
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
		});

	this.doRefresh	= function (perm)
	{
		this.panel.doRefresh (perm);
	};
};

var System_User = new JxSystemUser ();

//# sourceURL=module/System/User/layout.js
