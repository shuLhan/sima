function JxLogin ()
{
	this.id				= "Login";

	this.logo		= Ext.create ("Ext.Component", {
			height	:130
		,	html	:"<img "
					+"	src='images/home/login/logo.png'"
					+"	style='display:block; margin-left:auto; margin-right:auto;'"
					+"	height='128'/>"
		,	padding	:0
		});

	this.username		= Ext.create ("Ext.form.field.Text", {
			fieldLabel	:"Username"
		,	itemId		:"username"
		,	name		:"username"
		});

	this.password		= Ext.create ("Ext.form.field.Text", {
			fieldLabel	:"Password"
		,	itemId		:"password"
		,	name		:"password"
		,	inputType	:"password"
		,	listeners	:
			{
				scope		:this
			,	specialkey	:function (f, e)
				{
					if (e.ENTER == e.getKey ()) {
						this.doLogin ();
					}
				}
			}
		});

	this.buttonLogin	= Ext.create ("Ext.button.Button", {
			text			:"Login"
		,	itemId			:"login"
		,	iconCls			:"login"
		,	formBind		:true
		});

	this.buttonLogin.setHandler (this.doLogin, this);

	this.panel			= Ext.create ("Ext.form.Panel", {
			id			:this.id +"Form"
		,	url			:_g_module_path +"login.jsp"
		,	title		:".:: " + _g_title + " ::."
		,	defaults	:
			{
				labelStyle	:"font-weight:bold"
			,	vtype		:"alphanum"
			,	allowBlank	:false
			,	anchor		:"100%"
			}
		,	items		:
			[
				this.logo
			,	this.username
			,	this.password
			]
		,	buttons		:
			[
				"->"
			,	this.buttonLogin
			]
		});

	this.win		= Ext.create ("Ext.window.Window", {
		id			:this.id
	,	autoShow	:true
	,	draggable	:false
	,	closable	:false
	,	resizable	:false
	,	defaultFocus:"username"
	,	items		:
		[
			this.panel
		]
	});

	this.doLogin = function ()
	{
		this.panel.submit ({
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
}

Ext.onReady (function ()
{
	var loginwin = new JxLogin ();
});
