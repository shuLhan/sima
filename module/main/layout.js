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

Ext.onReady (function ()
{
	jx_menu_store		= new Ext.data.JsonStore ({
			storeId		:"jx_menu_store"
		,	fields		:
			[
				"title"
			,	"tbar"
			]
		,	proxy		:{
				type		:"ajax"
			,	url			:_g_module_path +"menu.jsp"
			,	reader		:{
					type		:"json"
				,	root		:"data"
				}
			}
		});

	jx_header			= Ext.create ("Ext.container.Container", {
			id			:"app-background"
		,	region		:"north"
		,	layout		:{
				type		:"hbox"
			,	align		:"middle"
			}
		,	height		:45
		,	items		:[{
				id			:"app-header"
			,	xtype		:"box"
			,	html		:_g_title
			,	flex		:1
			},{
				xtype	:"button"
			,	margin	:"0 5 0 0"
			,	scale	:"medium"
			,	text	:_g_c_username
			,	iconCls	:"account"
			,	menu	:[{
					text	:"Profile"
				,	iconCls	:"profile"
				},{
					text	:"Change password"
				,	iconCls	:"change-password"
				},{
					xtype	:"menuseparator"
				},{
					text	:"Logout"
				,	iconCls	:"logout"
				,	handler	:function (b)
					{
						jx_do_logout ();
					}
				}]
			}]
		});
	
	jx_footer			= Ext.create ("Ext.container.Container", {
			region		:"south"
		,	layout		:{
				type		:"hbox"
			,	align		:"middle"
			,	pack		:"center"
			}
		,	height		:20
		,	items		:[{
				id			:"app-footer"
			,	xtype		:"box"
			,	html		:_g_title +"&nbsp;&nbsp;&copy;&nbsp;&nbsp;2013 x10c-lab.com"
			,	flex		:1
			}]
		});

	jx_menu				= Ext.create ("Ext.tab.Panel", {
			region		:"north"
		,	padding		:"5 5 0 5"
		,	shadow		:true
		,	activeTab	:0
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
	
	function jx_menu_button_onClick (b)
	{
		/* Find menu module in content area. */
		switch (_g_content_type) {
		case 0:
			var c = jx_content.getComponent (b.module);

			if (c && c.getId () == b.module) {
				return;
			}
			break;
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
				} catch (e) {
					if (console) {
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
							b.on ("click", jx_menu_button_onClick, this);
						} else {
							var submenu = b.menu.items.items;

							for (var sm = 0; sm < submenu.length; sm++) {
								submenu [sm].on ("click", jx_menu_button_onClick, this);
							}
						}
					}
				}
			}
		});
	}

	jx_load_menus ();
});
