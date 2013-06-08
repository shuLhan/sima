Ext.onReady (function ()
{
	var jx_login_form = Ext.create ("Ext.form.Panel", {
			url				:_g_module_path +"login.jsp"
		,	title			:_g_title +" :: Login"
		,	id				:"login_form"
		,	defaults		:
			{
				vtype			:"alphanum"
			,	allowBlank		:false
			}
		,	items			:
			[{
				xtype			:"textfield"
			,	fieldLabel		:"User name"
			,	name			:"username"
			},{
				xtype			:"textfield"
			,	fieldLabel		:"Password"
			,	name			:"password"
			,	inputType		:"password"
			,	listeners		:
				{
					specialkey		:function (f, e)
					{
						if (e.ENTER == e.getKey ()) {
							f.up ("form").do_login ();
						}
					}
				}
			}]
		,	bbar			:
			[
				"->"
			,	"-"
			,{
				text			:"Login"
			,	itemId			:"login"
			,	formBind		:true
			,	handler			:function (b)
				{
					b.up ("form").do_login ();
				}
			}]

		,	do_login		:function ()
			{
				this.getForm ().submit ({
					success	:function (form, action)
					{
						location.href = _g_root;
					}
				,	failure	:function (form, action)
					{
						Jx.msg.error (action.result.data);
					}
				});
			}
		});

	var jx_login = Ext.create ("Ext.window.Window", {
		id			:"login"
	,	autoShow	:true
	,	draggable	:false
	,	closable	:false
	,	resizable	:false
	,	items		:
		[
			jx_login_form
		]
	});
});
