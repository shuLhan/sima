/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxMainHomeMenu (jx_main_home, pid, title)
{
	this._parent	= jx_main_home;
	this.id			= "main_home_menu"
	this.dir		= Jx.generateModDir (this.id);

	this.store	= Ext.create ("Jx.Store", {
			url			:this.dir
		,	singleApi	:false
		,	extraParams	:
			{
				pid			:pid
			}
		,	fields		:
			[
				"id"
			,	"label"
			,	"module"
			,	"image"
			,	"image_path"
			,	"description"
			,	"permission"
			]
		});

	this.view			= Ext.create ("Ext.view.View", {
		store			:this.store
	,	itemSelector	:"div.home-menu"
	,	overItemCls		:"home-menu-hover"
	,	anchor			:"100%"
	,	tpl				:Ext.create ("Ext.XTemplate"
			,	'<div id="home-menus">'
			,		'<tpl for=".">'
			,			'<div class="home-menu">'
			,				'<img width="98" height="98"'
			,					'src="/images/{image_path}" />'
			,				'<h3>{label}</h3>'
			,				'<span>{description}</span>'
			,			'</div>'
			,		'</tpl>'
			,	'</div>'
			)
	});

	this.panel		= Ext.create ("Ext.panel.Panel", {
			title	:title
		,	layout	:
			{
				type	:"anchor"
			}
		,	items	:[this.view]
		});

	this.store.load ();

	this.view.on ("itemclick", this.viewOnClick, this);
}

JxMainHomeMenu.prototype.viewOnClick = function (dv, rec, item, idx, e, eopts)
{
	var main = this._parent._parent;

	main.onMenuClick (rec.raw);

	for (var i = 0; i < main.menu.items.length; i++) {
		var tab		= main.menu.items.getAt (i);
		var tbar	= tab.getDockedItems ('toolbar[dock="top"]');

		for (var j = 0; j < tbar.length; j++) {
			for (var k = 0; k < tbar[j].items.items.length; k++) {
				if (tbar[j].items.items[k].module === rec.raw.module) {
					main.menu.setActiveTab (i);
					tbar[j].items.items[k].toggle (true, true);
					return;
				}
			}
		}
	}
};

function JxMainHome (jx_main, id)
{
	this._parent	= jx_main;
	this.id			= id;
	this.dir		= Jx.generateModDir (this.id);

	this.store	= Ext.create ("Jx.Store", {
			url			:this.dir
		,	singleApi	:false
		,	fields		:
			[
				"id"
			,	"items"
			,	"title"
			]
		});

	this.panel	= Ext.create ("Ext.panel.Panel", {
			autoScroll	:true
		,	items		:[]
		});

	this.store.on ("load", this.storeOnLoad, this);
}

JxMainHome.prototype.storeOnLoad	= function (store, records, success)
{
	if (! success) {
		Jx.msg.error ("Failed to load home menu! <br/>");
		return;
	}

	for (var i = 0; i < records.length; i++) {
		var p	= new JxMainHomeMenu (
					this
				,	records[i].raw.id
				,	records[i].raw.title
				);

		this.panel.add (p.panel);
	}
};

JxMainHome.prototype.hide = function ()
{
	this.panel.hide ();
};

JxMainHome.prototype.show = function ()
{
	this.panel.show ();
}

JxMainHome.prototype.init = function ()
{
	this.store.load ();
}
