/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)

	Custom grid panel with paging and row editor.
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
		var opts = Ext.merge ({}, this.panelConfig);
			opts = Ext.merge (opts, cfg.panelConfig);

		this.callParent ([opts]);
		this.initConfig (opts);

		this.createGrid (cfg);
		this.createForm (cfg);
	}

,	createGrid	:function (cfg)
	{
		var barName		= "Grid";
		var id			= ( cfg.id
						? cfg.id + barName
						: ( cfg.itemId
							? cfg.itemId + barName
							: "JxGridPagingFormEditor"+ barName));

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
		var barName		= "Form";
		var id			= ( cfg.id
						? cfg.id + barName
						: ( cfg.itemId
							? cfg.itemId + barName
							: "JxGridPagingFormEditor"+ barName));

		var opts	= Ext.merge ({
							store	:cfg.store
						,	itemId	:id
					}
					, this.formConfig);

			opts	= Ext.merge (opts, cfg.formConfig);

		this.form	= Ext.create ("Jx.Form", opts);

		/* Add each column's editor to form */
		for (var i = 0, c = null; i < cfg.columns.length; i++) {
			c = cfg.columns[i];

			if (undefined != c.columns) {
				var fs	= Ext.create ("Ext.form.FieldSet", {
						title			:c.header
					,	layout			:"anchor"
					,	defaultType		:"textfield"
					,	flex			:1
					,	fieldDefaults	:
						{
							anchor			:"100%"
						,	msgTarget		:"side"
						}
					});

				for (var k = 0, cc = null; k < c.columns.length; k++) {
					cc = c.columns[k];

					if (undefined != cc.editor) {
						if (undefined == cc.editor.fieldLabel) {
							cc.editor.fieldLabel = cc.header || cc.text;
						}
						cc.editor.name = cc.dataIndex;

						fs.add (cc.editor);
					}
				}

				this.form.add (fs);
			} else if (undefined != c.editor) {
				if (undefined == c.editor.fieldLabel) {
					c.editor.fieldLabel	= c.header || c.text;
				}
				c.editor.name		= c.dataIndex;

				this.form.add (c.editor);
			}
		}

		this.add (this.form);
	}

,	doRefresh : function (perm)
	{
		this.grid.doRefresh (perm);
	}

,	clearData	:function ()
	{
		this.grid.store.loadData ([], false);
	}
});
