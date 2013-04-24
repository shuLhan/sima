Ext.onReady (function ()
{
	var jx_login_form = Ext.create ("Ext.form.Panel", {
			xtype			:"form"
		,	standardSubmit	:true
		,	url				:_g_module_path +"login.jsp"
		,	title			:"Login"
		,	id				:"login_form"
		,	bodyPadding		:10
		,	border			:false
		,	defaults		:
			{
				anchor			:"100%"
			,	labelAlign		:"right"
			,	vtype			:"alphanum"
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
					success: function (form, action)
					{
						Jx.msg.info (action.result.data);
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
