/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)

	Custom grid panel with paging and form editor.
*/
Ext.define ("Jx.GridPaging.FormEditor", {
	extend		:"Ext.panel.Panel"
,	alias		:"widget.jx.gridpaging.formeditor"
,	config		:
	{
		layout		:
		{
			type		:"border"
		}
	,	titleAlign	:"center"
	,	closable	:true

	,	grid		:undefined
	,	isTree		:false
	,	gridConfig	:
		{
			region		:"center"
		,	doAdd		:function ()
			{
				this.ownerCt.form.setTitle ("Create new data");
				this.ownerCt.form.getForm ().reset ();
				this.ownerCt.form.show ();
			}
		,	doEdit		:function ()
			{
				this.ownerCt.form.setTitle ("Updating data");
				this.ownerCt.form.getForm ().reset ();
				this.ownerCt.form.loadRecord (this.selectedData[0]);
				this.ownerCt.form.show ();
			}
		,	doDelete	:function ()
			{
				this.ownerCt.form.getForm ().reset ();
				this.ownerCt.form.loadRecord (this.selectedData[0]);
				this.ownerCt.form.doSave ();
			}
		,	onSelectionChange	:function (model, data, e)
			{
				if (data.length > 0) {
					this.ownerCt.form.loadRecord (data[0]);
				}
			}
		}

	,	form			:undefined
	,	formConfig		:
		{
			region			:"east"		// position of form in grid.
		,	syncUseStore	:true
		,	hidden			:true
		,	split			:true
		}
	}

,	constructor	:function (cfg)
	{
		var opts = Ext.merge ({}, this.config);

		Ext.merge (opts, cfg);

		if (undefined === opts.id && undefined === opts.itemId) {
			opts.itemId = Jx.generateItemId (opts, "JxGridPagingFormEditor", "");
		}

		this.createGrid (opts);
		this.createForm (opts);

		opts.items	= [
						opts.grid
					,	opts.form
					];

		Ext.merge (this, opts);
		Ext.merge (this, opts.panelConfig);

		this.callParent ();
	}

,	createGrid	:function (cfg)
	{
		var opts	= {};
		var id		= Jx.generateItemId (cfg, "JxGridPagingFormEditor", "Grid");

		Ext.merge (opts, {
							itemId	: id
						,	_parent	: this
						,	store	: cfg.store
						,	columns	: cfg.columns
						});
		Ext.merge (opts, cfg.gridConfig);

		if (cfg.isTree) {
			cfg.grid = Ext.create ("Jx.GridTree", opts);
		} else {
			cfg.grid = Ext.create ("Jx.GridPaging", opts);
		}
	}

,	createForm	:function (cfg)
	{
		var opts	= {};
		var id		= Jx.generateItemId (cfg, "JxGridPagingFormEditor", "Form");

		Ext.merge (opts, {
							store	:cfg.store
						,	itemId	:id
						});
		Ext.merge (opts, cfg.formConfig);

		cfg.form = Ext.create ("Jx.Form", opts);

		cfg.form.columnsToFields (cfg.columns);
	}

,	doRefresh : function (perm)
	{
		this.grid.doRefresh (perm);
	}

,	clearData	:function ()
	{
		this.grid.clearData ();
	}
});
