/*
	Copyright 2013 - x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)

	Custom grid panel with paging and row editor.
*/
Ext.define ("Jx.GridPaging.RowEditor", {
	extend			:"Jx.GridPaging"
,	alias			:"jx.gridpaging.roweditor"
,	config			:
	{
		rowEditor		:undefined
	}

,	constructor		: function (config)
	{
		this.callParent (arguments);
		this.initConfig (config);

		this.createRowEditor (config);
	}

,	createRowEditor	:function (cfg)
	{
		var barName		= "RowEditor";
		var id			= (
							cfg.id
							? cfg.id + barName
							: (
								cfg.itemId
								? cfg.itemId + barName
								: "JxForm"+ barName
							)
						);

		this.rowEditor			= Ext.create ("Ext.grid.plugin.RowEditing", {
				pluginId		:id
			,	clicksToEdit	:2
			,	autoCancel		:false
			});

		/* Add listener for grid row editor */
		this.rowEditor.on ("beforeedit"	, this.onBeforeEdit	, this);
		this.rowEditor.on ("edit"		, this.doRowSave	, this);
		this.rowEditor.on ("canceledit"	, this.doRowCancel	, this);

		this.rowEditor.init (this);
	}

,	onBeforeEdit : function ()
	{
		if (this.store.action == "create") {
			return true;
		}

		this.store.proxy.extraParams.action	= this.store.action = "update";

		// check user selection
		this.getSelectedData ();
		if (this.selectedData.length <= 0) {
			return false;
		}

		return true;
	}

/*
	beforeAdd	:function, overridden by instance, return false to cancel.
	afterAdd	:function, overridden by instance.
*/
,	doAdd		:function ()
	{
		this.rowEditor.cancelEdit ();

		var r = this.store.model.create ();

		this.store.insert (0, r);
		this.rowEditor.startEdit (0, 0);
	}

,	doEdit		:function ()
	{
		this.rowEditor.cancelEdit ();
		this.rowEditor.startEdit (this.store.indexOf (this.selectedData[0]), 0);
	}

,	doDelete	:function ()
	{
		this.store.remove (this.selectedData);
		this.store.sync ();
	}

/*
	beforeRowSave	:function, overridden by instance, return false to cancel.
	afterRowSave	:function, overridden by instance.
*/
,	doRowSave	:function ()
	{
		if (this.beforeRowSave && typeof (this.beforeRowSave) === "function") {
			if (this.beforeRowSave () == false) {
				return false;
			}
		}

		this.store.proxy.extraParams.action = this.store.action;

		this.store.sync ({
				params		:this.store.proxy.extraParams
			,	scope		:this
			,	success		:function (batch, op)
				{
					Jx.msg.info (Jx.msg.AJAX_SUCCESS);

					this.store.proxy.extraParams.action = this.store.action = "read";

					// reload store to retrieve ID of data (for table that depend on ID)
					this.store.reload ();

					if (this.afterRowSave && typeof (this.afterRowSave) === "function") {
						this.afterRowSave ();
					}
				}
			,	failure		:function (batch, op)
				{
					Jx.msg.error (Jx.msg.AJAX_FAILURE);
				}
			});
	}

/*
	beforeRowCancel	:function, overridden by instance, return false to cancel.
	afterRowCancel	:function, overridden by instance.
*/
,	doRowCancel	:function ()
	{
		if (this.beforeRowCancel && typeof (this.beforeRowCancel) === "function") {
			if (this.beforeRowCancel () == false) {
				return false;
			}
		}

		if ("create" == this.store.action) {
			this.store.removeAt (0);
			if (this.store.count () > 0) {
				this.getSelectionModel ().select (0);
			}
		}

		if (this.afterRowCancel && typeof (this.afterRowCancel) === "function") {
			this.afterRowCancel ();
		}
	}
});
