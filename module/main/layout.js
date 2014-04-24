/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

var main;

function JxUserChangePassword ()
{
	this.id		= "ChangePassword";
	this.dir	= _g_module_path;

	this.store		= Ext.create ("Jx.Store", {
			storeId	:this.id
		,	url		:this.dir +"ChangePassword"+ _g_ext
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

		,	beforeFormSave	: function ()
			{
				/* Check if new-password and password-confirmation is equal. */
				var pass_1 = this.getComponent ("password_new").getValue ();
				var pass_2 = this.getComponent ("password_confirm").getValue ();

				if (pass_1 !== pass_2) {
					Jx.msg.error ("New password doesn't match!");
					return false;
				}

				this.store.action = "update";

				return true;
			}

		,	afterSaveSuccess	: function ()
			{
				this.ownerCt.close ();
			}

		,	afterFormCancel	: function ()
			{
				this.ownerCt.close ();
			}
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
		var r = [{ id : id }];

		this.store.loadData (r, false);

		this.panel.loadRecord (this.store.getAt (0));
		this.win.show ();
	};
}

function JxMain ()
{
	this.id					= "Main";
	this.menuStoreId		= this.id +"MenuStore";
	this.contentHomeId		= this.id +"Home";
	this.contentDashboardId	= this.id +"Dashboard";
	this.headerId			= this.id +"Header";
	this.headerLogo			= this.id +"HeaderLogo";
	this.headerTextId		= this.id +"HeaderText";
	this.footerId			= this.id +"Footer";
	this.dir				= _g_module_dir + this.id;
	this.userProfile		= undefined;

	this.store	= Ext.create ("Jx.Store", {
			storeId	:this.menuStoreId
		,	url		:_g_module_path +"menu"+ _g_ext
		,	fields	:
			[
				"title"
			,	"tbar"
			]
		});

	this.buttonProfile	= Ext.create ("Ext.menu.Item", {
			text		:"Profile"
		,	iconCls		:"profile"
		});

	this.buttonLogout	= Ext.create ("Ext.menu.Item", {
			text		:"Logout"
		,	iconCls		:"logout"
		});

	/*
		Main header
	*/
	this.header	= Ext.create ("Ext.container.Container", {
			id			:this.headerId
		,	region		:"north"
		,	height		:50
		,	layout		:
			{
				type		:"hbox"
			,	align		:"middle"
			,	pack		:"start"
			}
		,	items		:
			[{
				id			:this.headerLogo
			,	xtype		:"container"
			,	html		:"<img style='height:36;' src='../../images/logo.png'></img>"
			},{
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
				,	"-"
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
			,	html		:"<a href='https://github.com/shuLhan/Jaring'"
							+" target='_blank'>"+ _g_title
							+"&nbsp;&nbsp;&copy;&nbsp;&nbsp;"
							+ new Date().getFullYear()
							+" - Mhd Sulhan </a>"
			,	flex		:1
			}]
		});

	this.contentHome	= new JxMainHome (this);

	this.contentDashboard	= Ext.create ("Ext.panel.Panel", {
			region		:"center"
		,	padding		:"0 5 0 5"
		,	layout		:"fit"
		,	bodyCls		:"panel-background"
		,	hidden		:true
		});

	// Main interface
	this.main			= Ext.create ("Ext.container.Viewport", {
			layout		:"border"
		,	renderTo	:Ext.getBody ()
		,	items		:
			[
				this.header
			,	this.contentHome.panel
			,	this.contentDashboard
			,	this.footer
			]
		});

	/*
		Functions
	*/
	this.showUserProfile = function ()
	{
		if (this.userProfile === undefined) {
			this.userProfile = new JxMainUserProfile ();
		} else {
			if (this.userProfile.win !== undefined) {
				delete this.userProfile;
				this.userProfile = new JxMainUserProfile ();
			}
		}
		this.userProfile.doShow ();
	};

	this.doLogout = function ()
	{
		this.showLoading ();
		location.href = _g_module_path +"logout"+ _g_ext;
	};

	this.onTabChange	= function (tabp, newc, oldc, e)
	{
		if (newc.id === this.contentHomeId) {
			this.content.hide ();
			this.contentHome.show ();
			this.contentDashboard.hide ();
		} else if (newc.id === this.contentDashboardId) {
			this.content.hide ();
			this.contentHome.hide ();
			this.contentDashboard.show ();
		} else {
			this.content.show ();
			this.contentHome.hide ();
			this.contentDashboard.hide ();
		}
	};

	this.onMenuClick = function (b, force)
	{
		var tab, tbar;

		Jx.showMask ();

		if (b.id === this.contentHomeId) {
			this.content.hide ();
			this.contentHome.show ();
			Jx.hideMask ();
			return;
		}

		this.content.show ();
		this.contentHome.hide ();
		this.contentDashboard.hide ();

		switch (_g_menu_mode) {
		case 0:
			tab		= main.menu.getActiveTab ();
			tbar	= tab.dockedItems.getAt (0);

			// Remove toggle from menu button
			for (var i = 0; i < main.menu.items.length; i++) {
				tab = main.menu.items.getAt (i);
				tbar = tab.getDockedItems ('toolbar[dock="top"]');

				for (var j = 0; j < tbar.length; j++) {
					for (var k = 0; k < tbar[j].items.items.length; k++) {
						tbar[j].items.items[k].toggle (false, true);
					}
				}
			}

			if (b.toggle !== undefined) {
				b.toggle (true, true);
			}
			break;

		case 1:
			tbar	= main.menuBar;
			break;
		}

		// Find menu module in content area.
		switch (_g_content_type) {
		case 0:
			// do nothing
			break;
		case 1:
			var c = main.content.getComponent (b.module);

			if (c !== undefined) {
				main.content.setActiveTab (c);
				Jx.hideMask ();
				return;
			}
			break;
		}

		// If not exist, add module to content area
		Ext.Ajax.request ({
			url		:_g_module_dir + b.module.replace (/_/g, "/") +"/layout.js"
		,	failure	:function (response, opts)
			{
				Jx.msg.error ("Fail to load module!");
				Jx.hideMask ();
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
						main.content.removeAll (true);
						main.content.add (module.panel);
						break;
					case 1:
						main.content.add (module.panel);
						main.content.setActiveTab (module.panel);
						main.content.doLayout ();
						break;
					}

					module.doRefresh (b.permission);
					Jx.hideMask ();
				} catch (e) {
					if (undefined !== console) {
						console.log (e);
					}
					Jx.msg.error (e.message);
					Jx.hideMask ();
				}
			}
		});
	};

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
					var tab, tbar;

					switch (_g_menu_mode) {
					case 0:
						tab			= this.menu.add (r[i].raw);
						tbar		= tab.dockedItems.getAt (0);
						break;
					case 1:
						tbar	= this.menuBar;
						tbar.add (r[i].raw);
						break;
					}

					/* Inject "click" event to each button menu */
					for (var m = 0; tbar !== undefined && m < tbar.items.items.length; m++) {
						var b = tbar.items.items[m];

						if (undefined === b.menu) {
							b.setHandler (this.onMenuClick, this);
						} else {
							var submenu = b.menu.items.items;

							for (var sm = 0; sm < submenu.length; sm++) {
								submenu [sm].setHandler (this.onMenuClick, this);
							}
						}
					}
				}

				this.menu.setActiveTab (0);
			}
		});
	};

	this.showLoading = function ()
	{
		Ext.get ('loading').show ();
		Ext.get ('loading-mask').fadeIn ({
			remove		:false
		,	useDisplay	:true
		});
	};

	this.hideLoading = function ()
	{
		setTimeout (function ()
		{
			Ext.get ('loading').hide ();
			Ext.get ('loading-mask').fadeOut({
				remove		:false
			,	useDisplay	:true
			});
		}
		, 100);
	};

	this.init = function ()
	{
		switch (_g_menu_mode) {
		case 0:
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
							pack		:"left"
						}
					}
				,	items		:[]
				});

			this.menu.on ("tabchange", this.onTabChange, this);
			break;

		case 1:
			this.menuBar		= Ext.create ("Ext.toolbar.Toolbar", {
					dock		:"top"
				,	layout		:
					{
						overflowHandler	:"Menu"
					}
				,	items		:[]
				});

			this.menu			= Ext.create ("Ext.panel.Panel", {
					region		:"north"
				,	height		:40
				,	dockedItems	:
					[
						this.menuBar
					]
				});
			break;
		}

		switch (_g_content_type) {
		case 0:
			this.content		= Ext.create ("Ext.panel.Panel", {
					region		:"center"
				,	margin		:"5 0 0 0"
				,	padding		:"0 5 0 5"
				,	plain		:true
				,	layout		:"fit"
				,	bodyCls		:"panel-background"
				,	hidden		:true
				});
			break;
		case 1:
			this.content		= Ext.create ("Ext.tab.Panel", {
					region		:"center"
				,	margin		:"5 0 0 0"
				,	padding		:"0 5 0 5"
				,	plain		:true
				,	bodyCls		:"panel-background"
				,	hidden		:true
				,	items		:[]
				});
			break;
		}

		this.main.add (this.menu);
		this.main.add (this.content);

		this.buttonProfile.setHandler (this.showUserProfile, this);
		this.buttonLogout.setHandler (this.doLogout, this);

		this.loadMenu ();
		this.contentHome.init ();
		this.hideLoading ();
	};
}

Ext.onReady (function ()
{
	main = new JxMain ();

	main.init ();
});
