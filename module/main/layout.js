/*
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
*/
/* stores */
var jx_menu_store;
/* views */
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

	jx_menu				= Ext.create ("Ext.tab.Panel", {
			region		:"north"
		,	shadow		:true
		,	tabBar		:
			{
				height		:28
			,	defaults	:
				{
					height		:28
				,	padding		:4
				}
			}
		,	activeTab	:0
		,	items		:
			[{
				title		:"Home"
			,	iconCls		:"home"
			,	tbar		:
				[
					"->"
				,	"-"
				,{
					text		:"Logout"
				,	iconCls		:"logout"
				,	handler		:function (b)
					{
						jx_do_logout ();
					}
				}]
			}]
		});

	switch (_g_content_type) {
	case 0:
		jx_content		= Ext.create ("Ext.container.Container", {
				region	:"center"
			,	plain	:true
			,	layout	:"fit"
			});
		break;
	case 1:
		jx_content		= Ext.create ("Ext.tab.Panel", {
				region		:"center"
			,	plain		:true
			,	items		:[]
			});
		break;
	}

	jx_main				= Ext.create ("Ext.container.Viewport", {
			layout		:"border"
		,	renderTo	:Ext.getBody ()
		,	items		:
			[
				jx_menu
			,	jx_content
			]
		});

	function jx_do_logout ()
	{
		location.href = _g_module_path +"logout.jsp";
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
						jx_content.removeAll ();
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
