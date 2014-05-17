/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
 */
var SystemMenuGroup;
var SystemMenuMenu;

function JxSystemMenuMenu ()
{
	this.id		= "System_Menu_Access";
	this.dir	= Jx.generateModDir (this.id);

	this.store			= Ext.create ("Jx.StoreTree", {
			url			:this.dir
		,	autoSync	:true
		,	proxy		:
			{
				type		:"rest"
			,	appendId	:false
			,	noCache		:true
			}
		,	fields		:
			[
				"id"
			,	"parentId"
			,	"label"
			,	"iconCls"
			,	"module"
			,	"_group_id"
			,	"permission"
			]
		});

	this.storePerm	= Ext.create ("Ext.data.Store", {
			fields	:
			[{
				name	:"permission"
			,	type	:"int"
			},{
				name	:"name"
			,	type	:"string"
			}]
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

	this.panel				= Ext.create ("Ext.tree.Panel", {
			itemId			:this.id +"_Grid"
		,	region			:"east"
		,	width			:"50%"
		,	title			:"System Menu"
		,	titleAlign		:"center"
		,	split			:true
		,	layout			:"fit"
		,	useArrows		:true
		,	rootVisible		:false
		,	store			:this.store
		,	plugins			:
			[
				Ext.create ("Ext.grid.plugin.CellEditing", {
					clicksToEdit:2
				})
			]
		,	columns			:
			[{
				header			:"ID"
			,	dataIndex		:"id"
			,	hidden			:true
			},{
				header			:"PID"
			,	dataIndex		:"parentId"
			,	hidden			:true
			},{
				xtype			:"treecolumn"
			,	header			:"Name"
			,	dataIndex		:"label"
			,	flex			:1
			},{
				header			:"Module"
			,	dataIndex		:"module"
			,	hidden			:true
			},{
				header			:"Permission"
			,	dataIndex		:"permission"
			,	flex			:1
			,	renderer		:this.storePerm.renderData ("permission", "name")
			,	editor			:
				{
					xtype				:"combobox"
				,	valueField			:"permission"
				,	displayField		:"name"
				,	store				:this.storePerm
				,	editable			:false
				}
			}]
		,	tbar			:
			[{
				iconCls		:"refresh"
			,	tooltip		:"Refresh data"
			,	scope		:this
			,	handler		:function ()
				{
					this.store.reload ();
				}
			}]
		});

	this.doRefresh = function (perm, id)
	{
		if (id <= 0) {
			return;
		}

		this.store.proxy.extraParams._group_id = id;
		this.store.load ();
	};
}

function JxSystemMenuAccessGroup ()
{
	this.id		= "System_Group";
	this.dir	= Jx.generateModDir (this.id);

	this.store			= Ext.create ("Jx.StoreTree", {
			url			:this.dir
		,	singleApi	:true
		,	proxy		:
			{
				type		:"rest"
			,	appendId	:false
			,	noCache		:true
			}
		,	fields		:
			[
				"id"
			,	"pid"
			,	"name"
			,	"text"
			]
		});

	this.panel				= Ext.create ("Ext.tree.Panel", {
			itemId			:this.id +"_Grid"
		,	region			:"center"
		,	title			:"Group of User"
		,	titleAlign		:"center"
		,	useArrows		:true
		,	rootVisible		:false
		,	store			:this.store
		,	plugins			:
			[
				Ext.create ("Jx.plugin.CrudButtons", {
					buttonBarList	:["refresh"]
				})
			]
		,	columns			:
			[{
				header			:"ID"
			,	dataIndex		:"id"
			,	hidden			:true
			},{
				header			:"Parent Group"
			,	dataIndex		:"pid"
			,	hidden			:true
			},{
				header			:"Group name"
			,	xtype			:"treecolumn"
			,	dataIndex		:"text"
			,	flex			:1
			}]
		});

	this.doRefresh	= function (perm)
	{
		this.panel.fireEvent ("refresh", perm);
	};
}

function JxSystemMenuAccess ()
{
	this.id			= "System_Menu_Access";

	SystemMenuMenu	= new JxSystemMenuMenu ();
	SystemMenuGroup	= new JxSystemMenuAccessGroup ();

	this.panel			= Ext.create ("Ext.panel.Panel", {
			itemId		:this.id
		,	title		:"System Menu Access"
		,	titleAlign	:"center"
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
		this.perm = perm;
		SystemMenuGroup.doRefresh (perm);
	};

	this.onGroupSelect = function (sm, data)
	{
		if (data.length <= 0) {
			return;
		}

		var id = data[0].get ("id");

		SystemMenuMenu.doRefresh (this.perm, id);
	}

	SystemMenuGroup.panel.on ("selectionchange", this.onGroupSelect, this);
}

var System_Menu_Access = new JxSystemMenuAccess ();

//# sourceURL=module/System/Menu/Access/layout.js
