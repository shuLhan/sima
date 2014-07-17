/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function Jx_System_Profile ()
{
	this.id		= "System_Profile";
	this.dir	= Jx.generateModDir (this.id);

	this.storeUser	= Ext.create ("Jx.StoreRest",
					{
						url			:Jx.generateModDir ("System_Profile_User")
					,	fields		:
						[
							"_profile_id"
						,	"id"
						,	"name"
						,	"realname"
						]
					});

	this.storeUserNon	= Ext.create ("Jx.StoreRest",
					{
						url			:Jx.generateModDir ("System_Profile_UserNon")
					,	fields		:
						[
							"_profile_id"
						,	"id"
						,	"name"
						,	"realname"
						]
					});
	this.panel			= Ext.create ("Jx.CardGridForm",
	{
		itemId			:this.id
	,	title			:"Profile"
	,	url				:this.dir
	,	profile_id		:undefined
	,	f_profile_id	:undefined
	,	f_user_id		:undefined
	,	logo_image		:undefined
	,	gridConfig		:
		{
			afterEdit : function ()
			{
				if (this.selectedData.length > 0) {
					System_Profile.logo_image_refresh (this.selectedData[0].get ("id"));
				}
				System_Profile.f_user_id.hide ();
			}
		,	afterAdd : function ()
			{
				System_Profile.profile_id = new Date().getTime ();
				System_Profile.f_profile_id.setValue (System_Profile.profile_id);
				System_Profile.logo_image_refresh (System_Profile.profile_id);
				System_Profile.f_user_id.show ();
			}
		}
	,	formConfig	:
		{
			layout			:"column"
		,	syncUseStore	:false
		,	defaults		:
			{
				margin			:"0 10 0 0"
			}
		,	fieldDefaults	:
			{
				labelAlign		:"right"
			,	width			:340
			}
		,	listeners	:
			{
				"savesuccess"	:function (success)
				{
					this.store.action = "update";
				}
			,	"canceled"		:function ()
				{
					this._parent.doRefresh (this.perm);
				}
			}
		}

	,	fields		:
		[{
			header		:"Application Profile"
		,	flex		:1
		,	fsConfig	:
			{
				padding		:10
			}
		,	columns	:
			[{
				header		:"ID"
			,	dataIndex	:"id"
			,	hidden		:true
			,	editor		:
				{
					hidden		:true
				,	itemId		:"profile_id"
				}
			},{
				header		:"Administrator"
			,	dataIndex	:"_user_id"
			,	width		:200
			,	renderer	:this.storeUser.renderData ("id", "realname")
			,	editor		:
				{
					xtype			:"combo"
				,	itemId			:"_user_id"
				,	store			:this.storeUserNon
				,	valueField		:"id"
				,	displayField	:"realname"
				,	allowBlank		:false
				,	editable		:false
				}
			},{
				header		:"Name/Company"
			,	dataIndex	:"name"
			,	width		:300
			,	editor		:
				{
					allowBlank	:false
				}
			},{
				header		:"Address"
			,	dataIndex	:"address"
			,	hidden		:true
			,	editor		:
				{
					xtype		:"textarea"
				}
			},{
				header		:"Phone (1)"
			,	dataIndex	:"phone_1"
			,	hidden		:true
			,	editor		:
				{
					xtype			:"numberfield"
				,	allowDecimals	:false
				,	hideTrigger		:true
				}
			},{
				header		:"Phone (2)"
			,	dataIndex	:"phone_2"
			,	hidden		:true
			,	editor		:
				{
					xtype			:"numberfield"
				,	allowDecimals	:false
				,	hideTrigger		:true
				}
			},{
				header		:"Phone (3)"
			,	dataIndex	:"phone_3"
			,	hidden		:true
			,	editor		:
				{
					xtype			:"numberfield"
				,	allowDecimals	:false
				,	hideTrigger		:true
				}
			},{
				header		:"Fax"
			,	dataIndex	:"fax"
			,	hidden		:true
			,	editor		:
				{
					xtype			:"numberfield"
				,	allowDecimals	:false
				,	hideTrigger		:true
				}
			},{
				header		:"Email"
			,	dataIndex	:"email"
			,	hidden		:true
			,	editor		:
				{
					vtype		:"email"
				}
			},{
				header		:"Website"
			,	dataIndex	:"website"
			,	hidden		:true
			,	editor		:
				{
					vtype		:"url"
				}
			}]
		},{
			header	:"Logo"
		,	hidden	:true
		,	fsConfig:
			{
				layout	:
				{
					type	:"vbox"
				,	align	:"center"
				,	padding	:10
				}
			}
		,	columns	:
			[{
				header	:"Logo"
			,	hidden	:true
			,	editor	:
				{
					xtype		:"image"
				,	itemId		:"logo_image"
				,	url			:Jx.generateModDir ("System_Profile_Logo") + "read.php"
				,	height		:264
				,	width		:300
				,	margin		:"0 0 10 0"
				,	style		:"vertical-align:center; text-align:center;"
				}
			},{
				header		:"Change Logo"
			,	dataIndex	:"logo"
			,	hidden		:true
			,	editor		:
				{
					xtype		:"filefield"
				}
			}]
		}]
	});

	this.f_profile_id = this.panel.form.down ("#profile_id");
	this.f_user_id = this.panel.form.down ("#_user_id");
	this.logo_image = this.panel.form.down ("#logo_image");

	if (_g_profile_id !== 1) {
		this.panel.grid.buttonAdd.hide ();
		this.panel.grid.buttonDelete.hide ();
	}

	this.logo_image_refresh = function (id)
	{
		this.logo_image.setSrc (this.logo_image.url +"?_dc="+ (new Date()).getTime() +"&_profile_id="+ id);
	}

	this.doRefresh = function (perm)
	{
		var self = this;

		this.perm = perm;

		Jx.chainStoreLoad (
			[
				this.storeUser
			,	this.storeUserNon
			]
		,	function ()
			{
				self.panel.grid.doRefresh (perm);
			}
		,	0);
	}
}

var System_Profile = new Jx_System_Profile ();

//# sourceURL=module/System/Profile/layout.js
