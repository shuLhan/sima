/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
var SystemGroupUser;

//{{{ System Group -> User panel
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
				"_profile_id"
			,	"id"
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
		,	region			:"east"
		,	split			:true
		,	width			:"50%"
		,	title			:"Users of Group"
		,	closable		:false
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
				header			:"Profile ID"
			,	dataIndex		:"_profile_id"
			,	hidden			:true
			,	editor			:
				{
					hidden			:true
				}
			},{
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

		,	gridConfig	:
			{
			/* Disable combo _user_id before deletion */
				beforeDelete : function ()
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
//}}}
//{{{ System Group -> Group panel.
function JxSystemGroup_Group ()
{
	var self	= this;
	this.id		= "System_Group";
	this.dir	= Jx.generateModDir (this.id);

	this.store			= Ext.create ("Jx.StoreTree", {
			url			:this.dir
		,	fields		:
			[{
				name	:"_profile_id"
			,	type	:"int"
			},{
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

	this.f_pid	= Ext.create ("Ext.ux.TreeCombo", {
					rootVisible		:false
				,	selectChildren	:false
				,	canSelectFolders:true
				,	store			:this.store
				,	valueField		:"id"
				,	displayField	:"text"
				,	allowBlank		:false
				,	editable		:false
				});

	this.panel			= Ext.create ("Jx.GridPaging.FormEditor", {
			itemId		:this.id +"_Group"
		,	region		:"center"
		,	title		:"Group of User"
		,	isTree		:true
		,	store		:this.store
		,	closable	:false
		,	formConfig	:
			{
				region			:"south"
			,	syncUseStore	:false
			}
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
				header			:"ID"
			,	dataIndex		:"id"
			,	hidden			:true
			,	editor			:
				{
					hidden			:true
				}
			},{
				header			:"Parent Group"
			,	dataIndex		:"pid"
			,	hidden			:true
			,	editor			:this.f_pid
			},{
				header			:"Group name"
			,	xtype			:"treecolumn"
			,	dataIndex		:"text"
			,	name			:"name"
			,	flex			:1
			,	editor			:
				{
					allowBlank		:false
				}
			}]
		,	gridConfig	:
			{
				/* Disable combo parent id before deletion */
				beforeDelete : function ()
				{
					self.f_pid.allowBlank	= true;
					self.f_pid.editable		= true;
					self.f_pid.submitValue	= false;
					return true;
				}
			,	afterDelete : function ()
				{
					self.f_pid.allowBlank		= false;
					self.f_pid.forceSelection	= true;
					self.f_pid.submitValue		= true;
				}
			}
		});

	this.doRefresh	= function (perm)
	{
		this.perm				= perm;
		this.panel.grid.perm	= perm;
		this.panel.grid.fireEvent ("refresh", perm);
	};
}
//}}}
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

		this.Groups.panel.form.loadRecord (data[0]);

		this.Users.doRefresh (this.perm, id);
	}

	this.doRefresh = function (perm)
	{
		this.perm = perm;
		this.Groups.doRefresh (perm);
		this.Users.doRefresh (perm, 0);
	};

	this.Groups.panel.grid.on ("selectionchange", this.onGroupSelect, this);
};

var System_Group = new JxSystemGroup ();

//# sourceURL=module/System/Group/layout.js
