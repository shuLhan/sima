/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxMainHeader (jx_main, id)
{
	this.id				= id;
	this.dir			= Jx.generateModDir (this.id);
	this._parent		= jx_main;
	this.userProfile	= undefined;

	this.appLogo		= Ext.create ("Ext.Component", {
				id		:this.id +"_logo"
			,	html	:"<img src='"
							+ Jx.generateModDir ("System_Profile_Logo")
							+"read.php' />"
		});

	this.appTitle		= Ext.create ("Ext.Component", {
			id			:this.id +"_text"
		,	html		:_g_title
		,	flex		:1
		});


	this.buttonProfile	= Ext.create ("Ext.menu.Item", {
			text		:"Profile"
		,	iconCls		:"profile"
		});

	this.buttonLogout	= Ext.create ("Ext.menu.Item", {
			text		:"Logout"
		,	iconCls		:"logout"
		});

	this.buttonUser		= Ext.create ("Ext.button.Button", {
			margin		:"0 5 0 0"
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
		});

	this.panel			= Ext.create ("Ext.container.Container", {
			id			:this.id
		,	region		:"north"
		,	height		:50
		,	layout		:
			{
				type		:"hbox"
			,	align		:"middle"
			,	pack		:"start"
			}
		,	items		:
			[
				this.appLogo
			,	this.appTitle
			,	this.buttonUser
			]
		});

	this.buttonProfile.setHandler (this.showUserProfile, this);
	this.buttonLogout.setHandler (this.doLogout, this);
}

JxMainHeader.prototype.showUserProfile = function ()
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
}

JxMainHeader.prototype.doLogout = function ()
{
	this._parent.showLoading ();

	location.href = _g_module_path +"logout"+ _g_ext;
};
