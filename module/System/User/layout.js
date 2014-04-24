/*
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
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

	this.panel	= Ext.create ("Jx.GridPaging.FormEditor", {
		id			:this.id
	,	panelConfig	:
		{
			title		:"System User"
		,	closable	:true
		}
	,	store		:this.store
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

/* moduleName = className */
var System_User = new JxSystemUser ();
