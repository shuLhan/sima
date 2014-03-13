function JxLogin ()
{
	this.id				= "Login";

	this.logo			= Ext.create ("Ext.Component", {
			height		:130
		,	html		:"<img src='../../images/logo.png' />"
		,	margin		:'10'
		,	width		:"100%"
		,	style		:"vertical-align:center; text-align:center;"
	});

	this.username		= Ext.create ("Ext.form.field.Text", {
			fieldLabel	:"Username"
		,	itemId		:"username"
		,	name		:"username"
		,	labelAlign	:"right"
		});

	this.password		= Ext.create ("Ext.form.field.Text", {
			fieldLabel	:"Password"
		,	itemId		:"password"
		,	name		:"password"
		,	inputType	:"password"
		,	labelAlign	:"right"
		,	listeners	:
			{
				scope		:this
			,	specialkey	:function (f, e)
				{
					if (e.ENTER === e.getKey ()) {
						this.doLogin ();
					}
				}
			}
		});

	this.buttonLogin	= Ext.create ("Ext.button.Button", {
			text			:"Log In"
		,	itemId			:"login"
		,	iconCls			:"login"
		,	formBind		:true
		,	scope			:this
		,	handler			:function (b)
			{
				this.doLogin ();
			}
		});

	this.panel				= Ext.create ("Jx.Form", {
			id				:this.id +"Form"
		,	url				:_g_module_path +"login"+ _g_ext
		,	createButtonBar	:false
		,	syncUseStore	:false
		,	defaults		:
			{
				labelStyle		:"font-weight:bold"
			,	vtype			:"alphanum"
			,	allowBlank		:false
			}
		,	items			:
			[
				this.username
			,	this.password
			]
		,	layout			:'vbox'
		,	layoutConfig	:
			{
				padding		:'5'
			,	pack		:'center'
			,	align		:'middle'
			}
		,	buttons			:
			[
				this.buttonLogin
			]
		});

	this.win		= Ext.create ("Ext.window.Window", {
		id			:this.id
	,	title		:".:: " + _g_title + " ::."
	,	titleAlign	:"center"
	,	autoShow	:true
	,	draggable	:false
	,	closable	:false
	,	resizable	:false
	,	defaultFocus:"username"
	,	items		:
		[
			this.logo
		,	this.panel
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
	};
}

Ext.onReady (function ()
{
	var loginwin = new JxLogin ();
});
