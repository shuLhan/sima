/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

Ext.define ("Jx.app.System.Profile", {
	extend		:"Jx.Form"
,	itemId		:"System_Profile"
,	layout		:"column"
,	items		:
	[{
		xtype			:"fieldset"
	,	title			:"Application Profile"
	,	padding			:10
	,	fieldDefaults	:
		{
			labelAlign	:"right"
		,	width		:340
		}
	,	items		:
		[{
			fieldLabel		:"Name/Company"
		,	name			:"name"
		,	xtype			:"textfield"
		},{
			fieldLabel		:"Address"
		,	name			:"address"
		,	xtype			:"textarea"
		},{
			fieldLabel		:"Phone (1)"
		,	name			:"phone_1"
		,	xtype			:"numberfield"
		,	allowDecimals	:false
		,	hideTrigger		:true
		},{
			fieldLabel		:"Phone (2)"
		,	name			:"phone_2"
		,	xtype			:"numberfield"
		,	allowDecimals	:false
		,	hideTrigger		:true
		},{
			fieldLabel		:"Phone (3)"
		,	name			:"phone_3"
		,	xtype			:"numberfield"
		,	allowDecimals	:false
		,	hideTrigger		:true
		},{
			fieldLabel		:"Fax"
		,	name			:"fax"
		,	xtype			:"numberfield"
		,	allowDecimals	:false
		,	hideTrigger		:true
		},{
			fieldLabel		:"Email"
		,	name			:"email"
		,	xtype			:"textfield"
		},{
			fieldLabel		:"Website"
		,	name			:"website"
		,	xtype			:"textfield"
		}]
	},{
		xtype		:"fieldset"
	,	title		:"Logo"
	,	layout		:
		{
			type		:"vbox"
		,	align		:"center"
		,	padding		:10
		}
	,	items		:
		[{
			xtype		:"image"
		,	itemId		:"logo_image"
		,	url			:Jx.generateModDir ("System_Profile_Logo") + "read.php"
		,	width		:300
		,	height		:300
		},{
			xtype		:"button"
		,	itemId		:"logo_change"
		,	text		:"Change Logo"
		}]
	}]

,	config	:
	{
		title			:"Profile"
	,	closable		:true
	,	defaults		:
		{
			margin			:10
		}
	,	syncUseStore	:false
	,	logo_image		:undefined
	,	logo_change		:undefined

	,	afterFormSave	: function (success)
		{
			this.store.action = "update";
		}

	,	afterFormCancel	: function ()
		{
			this.doRefresh (this.perm);
		}
	}

,	constructor	: function (config)
	{
		var store		= Ext.create ("Jx.StoreRest", {
				url		: Jx.generateModDir (this.itemId)
			,	fields	:
				[
					"name"
				,	"address"
				,	"phone_1"
				,	"phone_2"
				,	"phone_3"
				,	"fax"
				,	"email"
				,	"website"
				]
			});

		var opts = {};
		Ext.merge (opts, this.config);
		Ext.merge (opts, {
				store	: store
			});
		Ext.merge (opts, config);

		this.callParent ([opts]);

		this.logo_image = this.down ("#logo_image");
		this.logo_change = this.down ("#logo_change");

		this.logo_image_refresh ();
		this.logo_change.on ("click", this.on_logo_change_click, this);
	}

,	logo_image_refresh : function ()
	{
		this.logo_image.setSrc (this.logo_image.url +"?_dc="+ (new Date()).getTime());
	}

,	on_logo_change_click : function ()
	{
		var self = this;

		var win = Ext.create ("Ext.window.Window", {
				title		:"Upload new logo"
			,	autoShow	:true
			,	modal		:true
			,	resizable	:false
			,	width		:400
			,	items		:
				[{
					xtype		:"form"
				,	layout		:"anchor"
				,	syncUseStore:false
				,	bodyPadding	:10
				,	url			:Jx.generateModDir ("System_Profile_Logo") +"update.php"
				,	items		:
					[{
						xtype		:"filefield"
					,	name		:"logo"
					,	buttonText	:"Select logo"
					,	anchor		:"100%"
					,	allowBlank	:false
					}]
				,	buttons		:
					[{
						text		:"Upload"
					,	formBind	:true
					,	handler		:function ()
						{
							this.up ("form").getForm ().submit ({
									success	:function (form, action)
									{
										Jx.msg.info (action.result.data);
										this.up ("window").close ();
										self.logo_image_refresh ();
									}
								,	failure	:function (form, action)
									{
										Jx.msg.error ("Upload failed");
									}
								,	scope	:this
								});
						}
					}]
				}]
			});
	}

,	doRefresh	: function (perm)
	{
		var self	= this;
		this.perm	= perm;

		Jx.chainStoreLoad (
			[
				this.store
			]
		,	function ()
			{
				if (self.store.getCount () <= 0) {
					var r = self.store.model.create ();
					self.store.insert (0, r);
					self.store.action = "create";
				} else {
					self.store.action = "update";
				}
				self.loadRecord (self.store.getAt (0));
			}
		,	0
		);
	}
});

var System_Profile = Ext.create ("Jx.app.System.Profile");

//# sourceURL=module/System/Profile/layout.js
