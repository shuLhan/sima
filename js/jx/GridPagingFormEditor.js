/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)

	Custom grid panel with paging and form editor.
*/
Ext.define ("Jx.GridPaging.FormEditor", {
	extend		:"Ext.panel.Panel"
,	alias		:"jx.gridpaging.formeditor"
,	config		:
	{
		panelConfig	:
		{
			layout		:"border"
		,	titleAlign	:"center"
		}
	,	grid		:undefined
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
		var id = Jx.generateItemId (cfg, "JxGridPagingFormEditor", "");

		var opts = Ext.merge ({
								itemId: id
							}, this.panelConfig);
			opts = Ext.merge (opts, cfg.panelConfig);

		this.callParent ([opts]);

		this.createGrid (cfg);
		this.createForm (cfg);
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
		Ext.merge (opts, this.gridConfig);

		this.grid = Ext.create ("Jx.GridPaging", opts);

		this.add (this.grid);
	}

,	createForm	:function (cfg)
	{
		var opts	= {};
		var id		= Jx.generateItemId (cfg, "JxGridPagingFormEditor", "Form");

		Ext.merge (opts, {
							store	:cfg.store
						,	itemId	:id
						});
		Ext.merge (opts, this.formConfig);
		Ext.merge (opts, cfg.formConfig);

		this.form = Ext.create ("Jx.Form", opts);

		this.form.columnsToFields (cfg.columns);

		this.add (this.form);
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
