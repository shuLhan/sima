Ext.onReady (function ()
{
	var jx_login_form = Ext.create ("Ext.form.Panel", {
			url				:_g_module_path +"login.jsp"
		,	title			:".:: " + _g_title + " ::."
		,	id				:"login_form"
		,	defaults		:
			{
				anchor			:"100%"
			,	labelAlign		:"right"
			,	labelWidth		:70
			,	labelStyle		:"font-weight:bold"
			,	vtype			:"alphanum"
			,	allowBlank		:false
			}
		,	items			:
			[{
				xtype			: 'component'
			,	html			: '<img src="images/main_logo.png" style="display:block; margin-left:auto; margin-right:auto;" height="128"/>'
			,	height			: 130
			,	padding			: '0 0 0 0'
			},{
				xtype			:"textfield"
			,	fieldLabel		:"Username"
			,	name			:"username"
			,	itemId			:"username"
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
		,	buttons			:
			[
				"->"
			,	"-"
			,{
				text			:"Login"
			,	itemId			:"login"
			,	iconCls			:"login"
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
	,	defaultFocus:"username"
	,	items		:
		[
			jx_login_form
		]
	});
});
