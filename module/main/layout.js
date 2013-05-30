/*
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
*/
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
			,	autoEl		:
				{
					tag			:"center"
				}
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

function JxMain ()
{
	this.id				= "Main";
	this.menuStoreId	= this.id +"MenuStore";
	this.contentHomeId	= this.id +"Home";
	this.headerId		= this.id +"Header";
	this.headerTextId	= this.id +"HeaderText";
	this.footerId		= this.id +"Footer";
	this.dir			= _g_module_dir + this.id;

	this.store	= Ext.create ("Jx.Store", {
			storeId	:this.menuStoreId
		,	url		:_g_module_path +"menu.jsp"
		,	fields	:
			[
				"title"
			,	"tbar"
			]
		});

	this.buttonProfile	= Ext.create ("Ext.button.Button", {
			text		:"Profile"
		,	iconCls		:"profile"
		});

	this.buttonLogout	= Ext.create ("Ext.button.Button", {
			text		:"Logout"
		,	iconCls		:"logout"
		});

	/*
		Main header
	*/
	this.header	= Ext.create ("Ext.container.Container", {
			id			:this.headerId
		,	region		:"north"
		,	height		:45
		,	layout		:
			{
				type		:"hbox"
			,	align		:"middle"
			}
		,	items		:
			[{
				id			:this.headerTextId
			,	xtype		:"box"
			,	html		:_g_title
			,	flex		:1
			},{
				xtype		:"button"
			,	margin		:"0 5 0 0"
			,	scale		:"medium"
			,	text		:_g_c_username
			,	iconCls		:"account"
			,	menuAlign	:"tr-br"
			,	menu		:
				[
					this.buttonProfile
				,	this.buttonLogout
				]
			}]
		});

	this.footer			= Ext.create ("Ext.container.Container", {
			id			:this.footerId
		,	region		:"south"
		,	height		:20
		,	layout		:
			{
				type		:"hbox"
			,	align		:"middle"
			,	pack		:"center"
			}
		,	items		:
			[{
				id			:"app-footer"
			,	xtype		:"box"
			,	html		:_g_title +"&nbsp;&nbsp;&copy;&nbsp;&nbsp;2013 x10c-lab.com"
			,	flex		:1
			}]
		});

	this.menu			= Ext.create ("Ext.tab.Panel", {
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
				id			:this.contentHomeId
			,	iconCls		:"home"
			}]
		});

	this.contentHome	= Ext.create ("Ext.panel.Panel", {
			region		:"center"
		,	margin		:"5 0 0 0"
		,	padding		:"0 5 0 5"
		,	bodyPadding	:5
		,	html		:"<h1>Welcome!</h1>"
		});

	// Main interface
	this.main			= Ext.create ("Ext.container.Viewport", {
			layout		:"border"
		,	renderTo	:Ext.getBody ()
		,	items		:
			[
				this.header
			,	this.menu
			,	this.contentHome
			,	this.footer
			]
		});

/*
	Functions
*/
	this.showUserProfile = function ()
	{
		if (this.userProfile == undefined) {
			this.userProfile = new JxUserProfile ();
		} else {
			if (this.userProfile.win != undefined) {
				delete this.userProfile;
				this.userProfile = new JxUserProfile ();
			}
		}
		this.userProfile.doShow ();
	}

	this.doLogout = function ()
	{
		location.href = _g_module_path +"logout.jsp";
	}

	this.onTabChange	= function (tabp, newc, oldc, e)
	{
		if (newc.id == this.contentHomeId) {
			this.content.hide ();
			this.contentHome.show ();
		} else {
			this.content.show ();
			this.contentHome.hide ();
		}
	}

	this.onMenuClick = function (b, force)
	{
		var me		= this;
		var tab		= me.menu.getActiveTab ();
		var tbar	= tab.dockedItems.getAt (0);

		/* Remove toggle from menu button */
		for (var m = 0; m < tbar.items.items.length; m++) {
			var mb = tbar.items.items[m];

			if (undefined == mb.menu) {
				mb.toggle (false, true);
			} else {
				var submenu = mb.menu.items.items;

				for (var sm = 0; sm < submenu.length; sm++) {
					submenu [sm].toggle (false, true);
				}
			}
		}

		b.toggle (true, true);

		/* Find menu module in content area. */
		switch (_g_content_type) {
		case 1:
			var c = me.content.getComponent (b.module);

			if (c != undefined) {
				me.content.setActiveTab (c);
				return;
			}
			break;
		}

		/* If not exist, add module to content area */
		Ext.Ajax.request ({
			scope	:me
		,	url		:_g_module_dir +"/"+ b.module +"/layout.js"
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
						me.content.removeAll (true);
						me.content.add (module.panel);
						break;
					case 1:
						me.content.add (module.panel);
						me.content.setActiveTab (module.panel);
						me.content.doLayout ();
						break;
					}

					module.doRefresh (b.permission);
				} catch (e) {
					if (undefined != console) {
						console.log (e);
					}
					Jx.msg.error (e.message);
				}
			}
		});
	}

	this.loadMenu	= function ()
	{
		this.store.load ({
			scope		:this
		,	callback	:function (r, op, success)
			{
				if (! success) {
					Jx.msg.error ("Failed to load application menu! <br/>");
					return;
				}

				/* Add tab with toolbar to menu */
				for (var i = 0; i < r.length; i++) {
					var tab		= this.menu.add (r[i].raw);
					var tbar	= tab.dockedItems.getAt (0);

					/* Inject "click" event to each button menu */
					for (var m = 0; m < tbar.items.items.length; m++) {
						var b = tbar.items.items[m];

						if (undefined == b.menu) {
							b.setHandler (this.onMenuClick, this);
						} else {
							var submenu = b.menu.items.items;

							for (var sm = 0; sm < submenu.length; sm++) {
								submenu [sm].setHandler (this.onMenuClick, this);
							}
						}
					}
				}
			}
		});
	}

	this.init = function ()
	{
		switch (_g_content_type) {
		case 0:
			this.content		= Ext.create ("Ext.container.Container", {
					region		:"center"
				,	margin		:"5 0 0 0"
				,	padding		:"0 5 0 5"
				,	plain		:true
				,	layout		:"fit"
				});
			break;
		default:
			this.content		= Ext.create ("Ext.tab.Panel", {
					region		:"center"
				,	margin		:"5 0 0 0"
				,	padding		:"0 5 0 5"
				,	plain		:true
				,	items		:[]
				});
			break;
		}

		this.main.add (this.content);

		this.buttonProfile.setHandler (this.showUserProfile, this);
		this.buttonLogout.setHandler (this.doLogout, this);

		this.menu.on ("tabchange", this.onTabChange, this);

		this.loadMenu ();
	}
}

Ext.onReady (function ()
{
	var main = new JxMain ();

	main.init ();
});
