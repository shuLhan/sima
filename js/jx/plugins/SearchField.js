/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

Ext.define ("Jx.plugin.SearchField", {
	extend			:"Ext.AbstractPlugin"
,	alias			:"jx.plugin.searchfield"
,	searchField		:undefined
,	lastSearchStr	:""

,	constructor	:function (config)
	{
		if (config) {
			Ext.apply(this, config);
		}
	}

,	init	:function (cmp)
	{
		/* Get or create top toolbar */
		var tbar	= undefined;
		var tbars	= cmp.getDockedItems ("toolbar[dock='top']");

		if (tbars.length > 0) {
			tbar = tbars[0];
		}

		if (undefined === tbar) {
			tbar = Ext.create ("Ext.toolbar.Toolbar", {
				dock		:"top"
			});
			cmp.addDocked (tbar);
		}

		this.searchField	= Ext.create ("Jx.SearchField", {
				itemId		:"searchfield"
			});

		tbar.add ("->");
		tbar.add (this.searchField);

		this.searchField.on ("specialkey", this.doSearch, this);
	}

/*
	beforeSearch	:function, overridden by instance, return false to cancel.
	afterSearch		:function, overridden by instance.
*/
,	doSearch	:function (f, e)
	{
		var v = f.getValue ();

		if (e.getKey ()	!= e.ENTER) {
			return;
		}

		if (this.cmp.beforeSearch
		&& typeof (this.cmp.beforeSearch) === "function") {
			if (this.cmp.beforeSearch (v) == false) {
				return;
			}
		}

		this.lastSearchStr						= v;
		this.cmp.store.proxy.extraParams.action	= this.cmp.store.action = "read";
		this.cmp.store.proxy.extraParams.query	= v;
		this.cmp.store.load ();

		if (this.cmp.afterSearch
		&& typeof (this.cmp.afterSearch) === "function") {
			this.cmp.afterSearch (v);
		}
	}
});
