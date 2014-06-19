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
		,	onItemDoubleClick	:function (view, record, itemEl, index, e)
			{
				this.ownerCt.grid._doEdit ();
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
		var id	= Jx.generateItemId (cfg.id, "JxGridPagingFormEditor", "Grid");

		/* Add row number to grid */
		cfg.columns.splice (0, 0, { xtype : "rownumberer" });

		var opts	= Ext.merge ({
						itemId	: id
					,	_parent	: this
					}, this.gridConfig);
			opts = Ext.merge (opts, cfg);

		this.grid = Ext.create ("Jx.GridPaging", opts);

		this.grid.on ("itemdblclick", this.grid.onItemDoubleClick, this.grid);

		this.add (this.grid);
	}

,	createForm	:function (cfg)
	{
		var id = Jx.generateItemId (cfg, "JxGridPagingFormEditor", "Form");

		var opts	= Ext.merge ({
							store	:cfg.store
						,	itemId	:id
					}
					, this.formConfig);

			opts	= Ext.merge (opts, cfg.formConfig);

		this.form	= Ext.create ("Jx.Form", opts);

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
