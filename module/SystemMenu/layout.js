/*
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
 */
var SystemMenuGroup;
var SystemMenuMenu;

function JxSystemMenuMenu ()
{
	this.id		= "SystemMenu_Menu";
	this.dir	= _g_module_dir + this.id.replace (/_/g, "/");

	this.store			= Ext.create ("Jx.StorePaging", {
			storeId		:this.id
		,	url			:this.dir +"/data.jsp"
		,	extraParams	:
			{
				_group_id	:0
			}
		,	fields		:
			[
				"id"
			,	"pid"
			,	"label"
			,	"icon"
			,	"module"
			,	"_group_id"
			,	"permission"
			]
		});

	this.storePerm	= Ext.create ("Ext.data.Store", {
			storeId			:this.id +"Perm"
		,	fields			:
			[
				"permission"
			,	"name"
			]
		,	data			:
			[{
				permission		:0
			,	name			:"No Access"
			},{
				permission		:1
			,	name			:"View only"
			},{
				permission		:2
			,	name			:"Only allow create"
			},{
				permission		:3
			,	name			:"Only allow create and update"
			},{
				permission		:4
			,	name			:"Full access"
			}]
		});

	this.panel					= Ext.create ("Jx.GridPaging", {
			id					:this.id
		,	region				:"east"
		,	split				:true
		,	width				:"50%"
		,	title				:"System Menu"
		,	store				:this.store
		,	autoCreateForm		:false
		,	autoCreateRowEditor	:true
		,	buttonBarList		:["edit", "refresh"]
		,	syncUseStore		:false
		,	columns				:
			[{
				header				:"ID"
			,	dataIndex			:"id"
			,	hidden				:true
			},{
				header				:"PID"
			,	dataIndex			:"pid"
			,	hidden				:true
			},{
				header				:"Name"
			,	dataIndex			:"label"
			,	flex				:1
			},{
				header				:"Icon"
			,	dataIndex			:"icon"
			,	hidden				:true
			},{
				header				:"Module"
			,	dataIndex			:"module"
			,	hidden				:true
			},{
				header				:"Group ID"
			,	dataIndex			:"_group_id"
			,	hidden				:true
			},{
				header				:"Permission"
			,	dataIndex			:"permission"
			,	flex				:1
			,	renderer			:this.storePerm.renderData ("permission", "name")
			,	editor				:
				{
					xtype				:"combobox"
				,	valueField			:"permission"
				,	displayField		:"name"
				,	store				:this.storePerm
				,	editable			:false
				}
			}]
		});

	this.doRefresh	= function (perm, id)
	{
		if (id <= 0) {
			this.panel.clearData ();
			return;
		}

		this.store.proxy.extraParams._group_id = id;
		this.panel.doRefresh (perm);
	}
}

function JxSystemMenuGroup ()
{
	this.id		= "SystemMenu_Group";
	this.dir	= _g_module_dir + this.id.replace (/_/g, "/");

	this.store			= Ext.create ("Jx.StorePaging", {
			storeId		:this.id
		,	url			:this.dir +"/data.jsp"
		,	fieldId		:"id"
		,	fields		:
			[
				"id"
			,	"name"
			]
		});

	this.panel				= Ext.create ("Jx.GridPaging", {
			id				:this.id
		,	region			:"center"
		,	title			:"Groups of User"
		,	store			:this.store
		,	autoCreateForm	:false
		,	buttonBarList	:["refresh"]
		,	syncUseStore	:false
		,	columns			:
			[{
				header			:"ID"
			,	dataIndex		:"id"
			,	hidden			:true
			},{
				header			:"Group name"
			,	dataIndex		:"name"
			,	flex			:1
			}]
		,	compDetails		:
			[
				SystemMenuMenu
			]
		});

	this.doRefresh	= function (perm)
	{
		this.panel.doRefresh (perm);
	}
}

function JxSystemMenu ()
{
	this.id			="SystemMenu";
	this.dir		= _g_module_dir + this.id;

	SystemMenuMenu	= new JxSystemMenuMenu ();
	SystemMenuGroup	= new JxSystemMenuGroup ();

	this.panel			= Ext.create ("Ext.container.Container", {
			id			:this.id
		,	title		:"Menu Access"
		,	closable	:true
		,	layout		:"border"
		,	items		:
			[
				SystemMenuGroup.panel
			,	SystemMenuMenu.panel
			]
		});

	this.doRefresh	= function (perm)
	{
		SystemMenuGroup.doRefresh (perm);
		SystemMenuMenu.doRefresh (perm, 0);
	}
}

var SystemMenu = new JxSystemMenu ();
