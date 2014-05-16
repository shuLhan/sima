/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
/*
	Plugin requirements:
	- parent component containt store.
 */
Ext.define ("Jx.plugin.CrudButtons", {
	extend	:"Ext.AbstractPlugin"
,	alias	:"jx.plugin.crudbuttons"

,	config	:
	{
		// order of buttons on toolbar
		buttonBarList		:["delete", "-", "edit", "add", "-", "refresh"]

		// true to show icon and text on buttons.
	,	buttonShowText		:false
	}

,	constructor	:function (config)
	{
		Ext.apply(this, config);
		this.callParent (arguments);
	}

,	init	:function (cmp)
	{
		/* Get or create top toolbar */
		var b		= undefined;
		var tbar	= undefined;
		var tbars	= cmp.getDockedItems ("toolbar[dock='top']");

		if (tbars.length > 0) {
			tbar = tbars[0];
		}

		if (undefined === tbar) {
			tbar		= Ext.create ("Ext.toolbar.Toolbar", {
				dock	:"top"
			});
			cmp.addDocked (tbar);
		}

		/* Show/hide button based on user configuration */
		for (var i = 0; i < this.buttonBarList.length; i++) {
			switch (this.buttonBarList[i]) {
			case "-":
				tbar.add (Ext.create ("Ext.toolbar.Separator"));
				break;

			case "add":
				cmp.buttonAdd		= Ext.create ("Ext.button.Button", {
						text		:this.buttonShowText ? "Add" : ""
					,	itemId		:"add"
					,	iconCls		:"add"
					,	disabled	:true
					,	tooltip		:"Add new record"
					});

				cmp.buttonAdd.setHandler (this._doAdd, this);
				tbar.add (cmp.buttonAdd);
				break;

			case "edit":
				cmp.buttonEdit		= Ext.create ("Ext.button.Button", {
						text		:this.buttonShowText ? "Edit" : ""
					,	itemId		:"edit"
					,	iconCls		:"edit"
					,	disabled	:true
					,	tooltip		:"Edit selected record"
					});

				cmp.buttonEdit.setHandler (this._doEdit, this);
				tbar.add (cmp.buttonEdit);
				break;

			case "delete":
				cmp.buttonDelete	= Ext.create ("Ext.button.Button", {
						text		:this.buttonShowText ? "Delete" : ""
					,	itemId		:"delete"
					,	iconCls		:"delete"
					,	disabled	:true
					,	tooltip		:"Delete selected record"
					});

				cmp.buttonDelete.setHandler (this._doDelete, this);
				tbar.add (cmp.buttonDelete);
				break;

			case "refresh":
				cmp.buttonRefresh	= Ext.create ("Ext.button.Button", {
						text		:this.buttonShowText ? "Refresh" : ""
					,	itemId		:"refresh"
					,	iconCls		:"refresh"
					,	disabled	:false
					,	tooltip		:"Refresh data"
					});

				cmp.buttonRefresh.setHandler (this._doRefresh, this);
				tbar.add (cmp.buttonRefresh);
				break;
			}
		}

		cmp.on ("selectionchange", this._onSelectionChange, this);
		cmp.on ("refresh", this._doRefresh, this);
	}

,	destroy	:function ()
	{
		this.cmp.un ("refresh", this._doRefresh, this);
		this.cmp.un ("selectionchange", this._onSelectionChange, this);
	}

/*
	beforeAdd	:function, overridden by instance, return false to cancel.
	afterAdd	:function, overridden by instance.
*/
,	_doAdd		:function ()
	{
		if (this.cmp.beforeAdd && typeof (this.cmp.beforeAdd) === "function") {
			if (this.cmp.beforeAdd () === false) {
				return false;
			}
		}

		if (this.cmp.perm < 2) {
			return false;
		}

		this.cmp.store.proxy.extraParams.action	= this.cmp.store.action = "create";

		if (this.cmp.doAdd && (typeof (this.cmp.doAdd) === "function")) {
			this.cmp.doAdd ();
		}

		if (this.cmp.afterAdd && typeof (this.cmp.afterAdd) === "function") {
			this.cmp.afterAdd ();
		}

		return true;
	}

/*
	beforeEdit	:function, overridden by instance, return false to cancel.
	afterEdit	:function, overridden by instance.
*/
,	_doEdit		:function ()
	{
		if (this.cmp.beforeEdit && typeof (this.cmp.beforeEdit) === "function") {
			if (this.cmp.beforeEdit () === false) {
				return false;
			}
		}
		if (this.cmp.perm < 3) {
			return false;
		}

		this.cmp.store.proxy.extraParams.action	= this.cmp.store.action = "update";

		if (this.cmp.selectedData.length <= 0) {
			return false;
		}

		if (this.cmp.doEdit && (typeof (this.cmp.doEdit) === "function")) {
			this.cmp.doEdit ();
		}
		if (this.cmp.afterEdit && typeof (this.cmp.afterEdit) === "function") {
			this.cmp.afterEdit ();
		}

		return true;	// return true to allow row editor
	}

/*
	beforeDelete	:function (), overridden by instance, return false to cancel.
	afterDelete		:function (), overridden by instance.
*/
,	_doDelete	:function ()
	{
		if (this.cmp.beforeDelete && typeof (this.cmp.beforeDelete) === "function") {
			if (this.cmp.beforeDelete () === false) {
				return false;
			}
		}
		if (this.cmp.perm < 4) {
			return false;
		}

		if (this.cmp.selectedData.length <= 0) {
			return false;
		}

		Jx.msg.confirm (
			function ()
			{
				this.cmp.store.proxy.extraParams.action	= this.cmp.store.action = "destroy";

				if (this.cmp.doDelete && (typeof (this.cmp.doDelete) === "function")) {
					this.cmp.doDelete ();
				}

				if (this.cmp.afterDelete && typeof (this.cmp.afterDelete) === "function") {
					this.cmp.afterDelete ();
				}
			}
		,	this
		);
	}

/*
	beforeRefresh	:function, overridden by instance, return false to cancel.
	afterRefresh	:function, overridden by instance.
*/
,	_doRefresh		:function (perm)
	{
		if (this.cmp.beforeRefresh && typeof (this.cmp.beforeRefresh) === "function") {
			if (this.cmp.beforeRefresh () === false) {
				return;
			}
		}

		this.cmp.perm = perm;
		if (this.cmp.buttonAdd) {
			this.cmp.buttonAdd.setDisabled (perm < 2);
		}
		this.cmp.getSelectionModel ().deselectAll ();
		this.cmp.store.proxy.extraParams.action	= this.cmp.store.action = "read";
		this.cmp.store.load ();

		if (this.cmp.afterRefresh && typeof (this.cmp.afterRefresh) === "function") {
			this.cmp.afterRefresh ();
		}

		return false;
	}

/*
	beforeSelectionChange	:function, overridden by instance, return false to cancel.
	afterSelectionChange	:function, overridden by instance.
*/
,	_onSelectionChange		:function (model, data, e)
	{
		var s = (data.length <= 0);

		this.cmp.selectedData = data;

		if (this.cmp.buttonDelete) {
			this.cmp.buttonDelete.setDisabled (this.cmp.perm < 4);
		}
		if (this.cmp.buttonEdit) {
			this.cmp.buttonEdit.setDisabled (this.cmp.perm < 3);
		}
	}
});

Ext.preg ("crudbuttons", Jx.plugin.CrudButtons);
