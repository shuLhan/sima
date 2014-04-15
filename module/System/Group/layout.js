/*
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
*/
var SystemGroupUser;

function JxSystemGroup_User ()
{
	this.id		= "System_Group_User";
	this.dir	= Jx.generateModDir (this.id);

	this.store			= Ext.create ("Jx.StorePaging", {
			url			:this.dir
		,	singleApi	:false
		,	extraParams	:
			{
				_group_id	:0
			}
		,	fields		:
			[
				"id"
			,	"_user_id"
			,	"_user_name"
			,	"_user_realname"
			,	"_group_id"
			]
		});

	this.dirNon	= Jx.generateModDir ("System_Group_UserNon");

	this.storeNon		= Ext.create ("Jx.StorePaging", {
			url			:this.dirNon
		,	singleApi	:false
		,	extraParams	:
			{
				_group_id	:0
			}
		,	fields		:
			[
				"_user_id"
			,	"_user_realname"
			]
		});

	this.fUserId			= Ext.create ("Jx.ComboPaging", {
			id				:"_user_id"
		,	store			:this.storeNon
		,	valueField		:"_user_id"
		,	displayField	:"_user_realname"
		,	allowBlank		:false
		});

	this.panel				= Ext.create ("Jx.GridPaging.FormEditor", {
			id				:this.id
		,	panelConfig		:
			{
				region			:"east"
			,	split			:true
			,	width			:"50%"
			,	title			:"Users of Group"
			}
		,	formConfig		:
			{
				region			:"south"
			,	syncUseStore	:false
			,	afterFormSave	:function (success)
				{
					if (success) {
						this.ownerCt.grid.__class__.storeNon.load ();
						this.ownerCt.form.hide ();
					}
				}
			}
		,	store			:this.store
		,	__class__		:this
		,	columns			:
			[{
				header			:"ID"
			,	dataIndex		:"id"
			,	hidden			:true
			,	editor			:
				{
					hidden			:true
				}
			},{
				header			:"User"
			,	dataIndex		:"_user_id"
			,	hidden			:true
			,	editor			:this.fUserId
			},{
				header			:"Group"
			,	dataIndex		:"_group_id"
			,	hidden			:true
			,	editor			:
				{
					hidden			:true
				}
			},{
				header			:"User"
			,	dataIndex		:"_user_realname"
			,	flex			:1
			}]

			/* Disable combo _user_id before deletion */
		,	beforeDelete : function ()
			{
				this.__class__.fUserId.allowBlank		= true;
				this.__class__.fUserId.forceSelection	= false;
				this.__class__.fUserId.submitValue		= false;
				return true;
			}
		,	afterDelete : function ()
			{
				this.__class__.fUserId.allowBlank		= false;
				this.__class__.fUserId.forceSelection	= true;
				this.__class__.fUserId.submitValue		= true;
			}
		});

	this.doRefresh	= function (perm, id)
	{
		if (id <= 0) {
			this.panel.clearData ();
			return;
		}

		this.store.proxy.extraParams._group_id		= id;
		this.storeNon.proxy.extraParams._group_id	= id;
		this.storeNon.load ();
		this.panel.doRefresh (perm);
	};
}

function JxSystemGroup ()
{
	this.id		= "System_Group";
	this.dir	= Jx.generateModDir (this.id);
	this.Users	= new JxSystemGroup_User ();

	this.store			= Ext.create ("Jx.StorePaging", {
			url			:this.dir
		,	singleApi	:false
		,	fieldId		:"id"
		,	fields		:
			[
				"id"
			,	"name"
			]
		});

	this.grid				= Ext.create ("Jx.GridPaging.FormEditor", {
			store			:this.store
		,	panelConfig		:
			{
				region			:"center"
			,	title			:"Group of User"
			}
		,	formConfig		:
			{
				region			:"south"
			,	syncUseStore	:false
			}
		,	columns			:
			[{
				header			:"ID"
			,	dataIndex		:"id"
			,	hidden			:true
			,	editor			:
				{
					hidden			:true
				}
			},{
				header			:"Group name"
			,	dataIndex		:"name"
			,	flex			:1
			,	editor			:
				{
					allowBlank		:false
				}
			}]
		,	compDetails		:
			[
				this.Users
			]
		});

	this.panel			= Ext.create ("Ext.panel.Panel", {
			id			:this.id
		,	title		:"System Group"
		,	titleAlign	:"center"
		,	closable	:true
		,	layout		:"border"
		,	items		:
			[
				this.grid
			,	this.Users.panel
			]
		});

	this.doRefresh = function (perm)
	{
		this.grid.doRefresh (perm);
		this.Users.doRefresh (perm, 0);
	};
};

var System_Group = new JxSystemGroup ();
