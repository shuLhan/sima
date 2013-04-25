Ext.onReady (function ()
{
	var jx_menu_store	= new Ext.data.JsonStore ({
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

	var jx_menu			= Ext.create ("Ext.tab.Panel", {
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

	var jx_content		= Ext.create ("Ext.tab.Panel", {
			region		:"center"
		,	plain		:true
		,	items		:[]
		});

	var jx_main			= Ext.create ("Ext.container.Viewport", {
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
		var modname = "Jx"+ b.module;

		/* Find menu module on all tab in content area. */
		var c = jx_content.getComponent (modname);

		if (c != undefined) {
			jx_content.setActiveTab (c);
			return;
		}

		/* Create new tab */
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

					var module = eval (modname);

					jx_content.add (module);
					jx_content.setActiveTab (module);
					jx_content.doLayout ();

					module.do_refresh ();
				} catch (e) {
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
