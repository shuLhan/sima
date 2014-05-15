/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxMainDashboard (jx_main, id)
{
	this.id			= id;
	this.dir		= Jx.generateModDir (this.id);
	this._parent	= jx_main;

	this.panel	= Ext.create ("Ext.panel.Panel", {
			region		:"center"
		,	padding		:"0 5 0 5"
		,	layout		:"fit"
		,	bodyCls		:"panel-background"
		,	hidden		:true
		});
}

JxMainDashboard.prototype.show = function ()
{
	this.panel.show ();
}

JxMainDashboard.prototype.hide = function ()
{
	this.panel.hide ();
}

JxMainDashboard.prototype.doRefresh = function ()
{
}
