/*
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
*/
/* stores */
var jx_menu_store;
/* views */
var jx_header;
var jx_footer;
var jx_menu;
var jx_content;
var jx_main;
var jx_menu_button_last_click;
var jx_UserProfile;

function JxUserChangePassword ()
{
	this.id		= "ChangePassword";
	this.dir	= _g_module_path;

	this.store		= Ext.create ("Jx.Store", {
			storeId	:this.id
		,	url		:this.dir +"ChangePassword.jsp"
		,	fields	:
			[
				"id"
			,	"password_current"
			,	"password_new"
			,	"password_confirm"
			]
		});

	this.panel				= Ext.create ("Jx.Form", {
			id				:this.id +"Form"
		,	owner			:this
		,	store			:this.store
		,	fieldDefaults	:
			{
				labelWidth		:160
			,	vtype			:"alphanum"
			,	allowBlank		:false
			}
		,	items			:
			[{
				name			:"id"
			,	hidden			:true
			},{
				fieldLabel		:"Current password"
			,	name			:"password_current"
			},{
				fieldLabel		:"New password"
			,	name			:"password_new"
			,	itemId			:"password_new"
			},{
				fieldLabel		:"Confirm new password"
			,	name			:"password_confirm"
			,	itemId			:"password_confirm"
			}]
		});

	this.win	= Ext.create ("Ext.window.Window", {
			id			:this.id
		,	title		:"Change Password"
		,	modal		:true
		,	draggable	:false
		,	autoResize	:false
		,	layout		:"fit"
		,	items		:
			[
				this.panel
			]
		});

	this.doShow	= function (id)
	{
		var r = [{ id : id }]

		this.store.loadData (r, false);

		this.panel.loadRecord (this.store.getAt (0));
		this.win.show ();
	}

	this.beforeFormSave	= function ()
	{
		/* Check if new-password and password-confirmation is equal. */
		var pass_1 = this.panel.getComponent ("password_new").getValue ();
		var pass_2 = this.panel.getComponent ("password_confirm").getValue ();

		if (pass_1 != pass_2) {
			Jx.msg.error ("New password doesn't match!");
			return false;
		}

		this.store.action = "update";

		return true;
	}

	this.afterFormSave = function (success)
	{
		if (success) {
			this.win.close ();
		}
	}

	this.afterFormCancel = function ()
	{
		this.win.close ();
	}
}

function JxUserProfile ()
{
	this.id		= "UserProfile";
	this.dir	= _g_module_path;

	this.store			= Ext.create ("Jx.Store", {
			storeId		:this.id
		,	url			:this.dir +"UserProfile.jsp"
		,	fields		:
			[
				"id"
			,	"name"
			,	"realname"
			,	"group_name"
			]
		});

	this.buttonChangePassword	= Ext.create ("Ext.button.Button", {
			text		:"Change password"
		,	itemId		:"changePassword"
		,	iconCls		:"change-password"
		,	tooltip		:"Click this button to change your password"
		});

	this.doChangePassword	= function ()
	{
		var winChangePassword = new JxUserChangePassword ();

		winChangePassword.doShow (this.store.getAt (0).get ("id"));
	}

	this.buttonChangePassword.setHandler (this.doChangePassword, this);

	this.panel			= Ext.create ("Jx.Form", {
			id			:this.id +"Form"
		,	owner		:this
		,	store		:this.store
		,	items		:
			[{
				name		:"id"
			,	hidden		:true
			},{
				fieldLabel	:"User name"
			,	name		:"realname"
			,	allowBlank	:false
			},{
				fieldLabel	:"User ID"
			,	name		:"name"
			,	disabled	:true
			},{
				fieldLabel	:"Group"
			,	name		:"group_name"
			,	disabled	:true
			},{
				xtype		:"fieldset"
			,	shrinkWrap	:true
			,	cls			:"center-align"
			,	layout		:
				{
					type		:"hbox"
				,	pack		:"center"
				,	align		:"middle"
				,	padding		:10
				}
			,	items		:
				[
					this.buttonChangePassword
				]
			}]
		});

	this.win			= Ext.create ("Ext.window.Window", {
			id			:this.id
		,	title		:"User Profile"
		,	modal		:true
		,	draggable	:false
		,	autoResize	:false
		,	layout		:"fit"
		,	items		:
			[
				this.panel
			]
		});

	this.doShow	= function ()
	{
		this.store.load ({
			scope		:this
		,	callback	:function (r, op, success)
			{
				if (! success) {
					Jx.msg.error ("Failed to load user's profile!");
					return false;
				}
				if (r.length <= 0) {
					Jx.msg.error ("Can't load user's profile!");
					return false;
				}
				this.panel.loadRecord (r[0]);
				this.win.show ();
				return true;
			}
		});
		return true;
	}

	this.beforeFormSave	= function ()
	{
		this.store.action = "update";
	}

	this.afterFormSave = function (success)
	{
		if (success) {
			this.win.close ();
		}
	}

	this.afterFormCancel = function ()
	{
		this.win.close ();
	}
}

Ext.onReady (function ()
{
	jx_menu_store		= new Ext.data.JsonStore ({
			storeId		:"jx_menu_store"
		,	fields		:
			[
				"title"
			,	"tbar"
			]
		,	proxy		:
			{
				type		:"ajax"
			,	url			:_g_module_path +"menu.jsp"
			,	reader		:
				{
					type		:"json"
				,	root		:"data"
				}
			}
		});

	jx_header			= Ext.create ("Ext.container.Container", {
			id			:"app-background"
		,	region		:"north"
		,	layout		:
			{
				type		:"hbox"
			,	align		:"middle"
			}
		,	height		:45
		,	items		:
			[{
				id			:"app-header"
			,	xtype		:"box"
			,	html		:_g_title
			,	flex		:1
			},{
				xtype		:"button"
			,	margin		:"0 5 0 0"
			,	scale		:"medium"
			,	text		:_g_c_username
			,	iconCls		:"account"
			,	menu		:
				[{
					text		:"Profile"
				,	iconCls		:"profile"
				,	handler		:function (b)
					{
						jx_show_UserProfile ();
					}
				},"-",{
					text		:"Logout"
				,	iconCls		:"logout"
				,	handler		:function (b)
					{
						jx_do_logout ();
					}
				}]
			}]
		});
	
	jx_footer			= Ext.create ("Ext.container.Container", {
			region		:"south"
		,	layout		:
			{
				type		:"hbox"
			,	align		:"middle"
			,	pack		:"center"
			}
		,	height		:20
		,	items		:
			[{
				id			:"app-footer"
			,	xtype		:"box"
			,	html		:_g_title +"&nbsp;&nbsp;&copy;&nbsp;&nbsp;2013 x10c-lab.com"
			,	flex		:1
			}]
		});

	jx_menu				= Ext.create ("Ext.tab.Panel", {
			region		:"north"
		,	padding		:"5 5 0 5"
		,	activeTab	:0
		,	plain		:true
		,	centered	:true
		,	tabBar		:
			{
				plain		:true
			,	layout		:
				{
					pack		:"center"
				}
			}
		,	items		:
			[{
				id			:"content_home"
			,	iconCls		:"home"
			}]
		});

	jx_content_home		= Ext.create ("Ext.panel.Panel", {
			region		:"center"
		,	margin		:"5 0 0 0"
		,	padding		:"0 5 0 5"
		,	bodyPadding	:5
		,	html		:"<h1>Welcome!</h1>"
		});
		
	switch (_g_content_type) {
	case 0:
		jx_content			= Ext.create ("Ext.container.Container", {
				region		:"center"
			,	margin		:"5 0 0 0"
			,	padding		:"0 5 0 5"
			,	plain		:true
			,	layout		:"fit"
			});
		break;
	case 1:
		jx_content			= Ext.create ("Ext.tab.Panel", {
				region		:"center"
			,	margin		:"5 0 0 0"
			,	padding		:"0 5 0 5"
			,	plain		:true
			,	items		:[]
			});
		break;
	}

	jx_menu.on ("tabchange", jx_onTabChange);
	
	jx_main				= Ext.create ("Ext.container.Viewport", {
			layout		:"border"
		,	renderTo	:Ext.getBody ()
		,	items		:
			[
				jx_header
			,	jx_menu
			,	jx_content
			,	jx_content_home
			,	jx_footer
			]
		});

	function jx_show_UserProfile ()
	{
		if (jx_UserProfile == undefined) {
			jx_UserProfile = new JxUserProfile ();
		} else {
			if (jx_UserProfile.win != undefined) {
				delete jx_UserProfile;
				jx_UserProfile = new JxUserProfile ();
			}
		}
		jx_UserProfile.doShow ();
	}

	function jx_do_logout ()
	{
		location.href = _g_module_path +"logout.jsp";
	}

	function jx_onTabChange (tabp, newc, oldc, e)
	{
		if (newc.id == "content_home") {
			jx_content.hide ();
			jx_content_home.show ();
		} else {
			jx_content.show ();
			jx_content_home.hide ();
		}
	}
	
	function jx_menu_button_onClick (b, force)
	{
		/* Find menu module in content area. */
		switch (_g_content_type) {
		case 1:
			var c = jx_content.getComponent (b.module);

			if (c != undefined) {
				jx_content.setActiveTab (c);
				return;
			}
			break;
		}

		/* If not exist, add module to content area */
		Ext.Ajax.request ({
			url		:_g_module_dir +"/"+ b.module +"/layout.js"
		,	failure	:function (response, opts)
			{
				Jx.msg.error ("Fail to load module!");
			}
		,	success	:function (response, opts)
			{
				try {
					window.execScript
						? window.execScript (response.responseText)
						: window.eval (response.responseText);

					var module = eval (b.module);

					switch (_g_content_type) {
					case 0:
						jx_content.removeAll (true);
						jx_content.add (module.panel);
						break;
					case 1:
						jx_content.add (module.panel);
						jx_content.setActiveTab (module.panel);
						jx_content.doLayout ();
						break;
					}

					module.doRefresh (b.permission);

					jx_menu_button_last_click = b;
				} catch (e) {
					if (undefined != console) {
						console.log (e);
					}
					Jx.msg.error (e.message);
				}
			}
		});
	}

	function jx_load_menus ()
	{
		jx_menu_store.load ({
			scope		:this
		,	callback	:function (r, op, success)
			{
				if (! success) {
					Jx.msg.error ("Failed to load application menu! <br/>");
					return;
				}

				/* Add tab with toolbar to menu */
				for (var i = 0; i < r.length; i++) {
					var tab		= jx_menu.add (r[i].raw);
					var tbar	= tab.dockedItems.getAt (0);

					/* Inject "click" event to each button menu */
					for (var m = 0; m < tbar.items.items.length; m++) {
						var b = tbar.items.items[m];

						if (undefined == b.menu) {
							b.setHandler (jx_menu_button_onClick, this);
						} else {
							var submenu = b.menu.items.items;

							for (var sm = 0; sm < submenu.length; sm++) {
								submenu [sm].setHandler (jx_menu_button_onClick, this);
							}
						}
					}
				}
			}
		});
	}

	jx_load_menus ();
});
