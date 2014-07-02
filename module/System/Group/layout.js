/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
var SystemGroupUser;

function JxSystemGroup_User ()
{
	var self	= this;
	this.id		= "System_Group_User";
	this.dir	= Jx.generateModDir (this.id);

	this.store			= Ext.create ("Jx.StoreRest", {
			url			:this.dir
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

	this.storeNon		= Ext.create ("Jx.StoreRest", {
			url			:this.dirNon
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
			itemId			:"_user_id"
		,	store			:this.storeNon
		,	valueField		:"_user_id"
		,	displayField	:"_user_realname"
		,	allowBlank		:false
		,	editable		:false
		,	typeAhead		:false
		});

	this.panel				= Ext.create ("Jx.GridPaging.FormEditor", {
			itemId			:this.id
		,	store			:this.store
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
						self.storeNon.load ();
						this.ownerCt.form.hide ();
					}
				}
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
				self.fUserId.allowBlank		= true;
				self.fUserId.editable		= true;
				self.fUserId.submitValue	= false;
				return true;
			}
		,	afterDelete : function ()
			{
				self.fUserId.allowBlank		= false;
				self.fUserId.forceSelection	= true;
				self.fUserId.submitValue	= true;
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

function JxSystemGroup_Group ()
{
	var self	= this;
	this.id		= "System_Group";
	this.dir	= Jx.generateModDir (this.id);

	this.store			= Ext.create ("Jx.StoreTree", {
			url			:this.dir
		,	fields		:
			[{
				name	:"id"
			,	type	:"int"
			},{
				name	:"pid"
			,	type	:"int"
			},{
				name	:"name"
			,	type	:"string"
			},{
				name	:"text"
			,	type	:"string"
			}]
		});

	this.form				= Ext.create ("Jx.Form", {
			itemId			:this.id +"_Form"
		,	store			:self.store
		,	syncUseStore	:false
		,	hidden			:true
		,	region			:"south"
		,	split			:true
		,	layout			:"anchor"
		,	defaults		:
			{
				labelAlign		:"right"
			,	anchor			:"100%"
			}
		,	items			:
			[{
				name			:"id"
			,	hidden			:true
			},{
				fieldLabel		:"Parent Group"
			,	name			:"pid"
			,	xtype			:"treecombo"
			,	rootVisible		:false
			,	selectChildren	:false
			,	canSelectFolders:true
			,	store			:self.store
			,	valueField		:"id"
			,	displayField	:"text"
			,	allowBlank		:false
			,	editable		:false
			},{
				fieldLabel		:"Group name"
			,	name			:"name"
			,	allowBlank		:false
			}]
		});

	this.grid				= Ext.create ("Ext.tree.Panel", {
			itemId			:this.id +"_Grid"
		,	region			:"center"
		,	useArrows		:true
		,	rootVisible		:false
		,	store			:this.store
		,	plugins			:
			[
				Ext.create ("Jx.plugin.CrudButtons")
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
		,	doAdd		:function ()
			{
				self.form.setTitle ("Create new data");
				self.form.getForm ().reset ();
				self.form.show ();
			}
		,	doEdit		:function ()
			{
				self.form.setTitle ("Updating data");
				self.form.getForm ().reset ();
				self.form.loadRecord (this.selectedData[0]);
				self.form.show ();
			}
		,	doDelete	:function ()
			{
				self.form.getForm ().reset ();
				self.form.loadRecord (this.selectedData[0]);
				self.form.doSave ();
			}
		});

	this.panel	= Ext.create ("Ext.panel.Panel", {
			itemId		:this.id +"_Group"
		,	region		:"center"
		,	title		:"Group of User"
		,	titleAlign	:"center"
		,	layout		:"border"
		,	items		:
			[
				this.grid
			,	this.form
			]
		});

	this.doRefresh	= function (perm)
	{
		this.perm		= perm;
		this.grid.perm	= perm;
		this.grid.fireEvent ("refresh", perm);
	};
}

function JxSystemGroup ()
{
	this.id		= "System_Group";
	this.dir	= Jx.generateModDir (this.id);
	this.Users	= new JxSystemGroup_User ();
	this.Groups	= new JxSystemGroup_Group ();

	this.panel			= Ext.create ("Ext.panel.Panel", {
			itemId		:this.id
		,	title		:"System Group"
		,	titleAlign	:"center"
		,	closable	:true
		,	layout		:"border"
		,	items		:
			[
				this.Groups.panel
			,	this.Users.panel
			]
		});

	this.onGroupSelect = function (sm, data)
	{
		if (data.length <= 0) {
			return;
		}

		var id = data[0].get ("id");

		this.Groups.form.loadRecord (data[0]);

		this.Users.doRefresh (this.perm, id);
	}

	this.doRefresh = function (perm)
	{
		this.perm = perm;
		this.Groups.doRefresh (perm);
		this.Users.doRefresh (perm, 0);
	};

	this.Groups.grid.on ("selectionchange", this.onGroupSelect, this);
};

var System_Group = new JxSystemGroup ();

//# sourceURL=module/System/Group/layout.js
