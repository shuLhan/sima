/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

Ext.define ("Jx.CardGridForm", {
	extend		:"Ext.panel.Panel"
,	alias		:"jx.cardgridform"
,	layout		:"card"
,	titleAlign	:"center"
,	config		:
	{
		perm		:0
	,	itemId		:""
	,	url			:""
	,	store		:undefined
	,	fields		:[]
	,	grid		:undefined
	,	form		:undefined
	,	formConfig	:{}

	,	closable	:true
	}

,	statics		:
	{
//{{{ function: convert column to field.
		columnToField : function (c)
		{
			var f = {};

			if (undefined !== c.dataIndex) {
				f.name = c.dataIndex;

				if (undefined !== c.type) {
					f.type = c.type;
				} else if (undefined !== c.xtype) {
					// use column xtype as field type
					switch (c.xtype) {
					case "datecolumn":
						f.type = "date";
						if (undefined !== c.dateFormat) {
							f.dateFormat = c.dateFormat;
						} else {
							f.dateFormat = "c"
						}
						break;
					}
				}
			}

			return f;
		}
//}}}
//{{{ function: create store.
	,	createStore : function (self, opts)
		{
			if (undefined !== opts.store) {
				return;
			}

			var fields	= [];
			var nfield	= opts.fields.length;

			for (var i = 0, c = undefined, f = undefined; i < nfield; i++) {
				c = opts.fields[i];
				f = {};

				if (undefined !== c.columns) {
					for (var k = 0, cc = undefined; k < c.columns.length; k++) {
						cc	= c.columns[k];
						f	= Jx.CardGridForm.columnToField (cc);

						if (! Ext.Object.isEmpty (f)) {
							fields.push (f);
						}
					}
				} else {
					f = Jx.CardGridForm.columnToField (c);

					if (! Ext.Object.isEmpty (f)) {
						fields.push (f);
					}
				}
			}

			self.store		= Ext.create ("Jx.StoreRest", {
					url		: opts.url
				,	fields	: fields
				});
		}
//}}}
//{{{ grid
	,	createGrid : function (self, opts)
		{
			var id = Jx.generateItemId (opts, "JxCardGridForm", "Grid");

			/* Add row number to grid */
			opts.fields.splice (0, 0, { xtype : "rownumberer" });

			var cfg = {};

			Ext.merge (cfg, {
					itemId			: id
				,	_parent			: self
				,	store			: self.store
				,	columns			: opts.fields

				,	doAdd	:function ()
					{
						self.form.setTitle ("Create new data");
						self.form.getForm ().reset ();
						self.getLayout ().setActiveItem (self.form);
					}
				,	doEdit	:function ()
					{
						self.form.setTitle ("Updating data");
						self.form.getForm ().reset ();
						self.form.loadRecord (this.selectedData[0]);
						self.getLayout ().setActiveItem (self.form);
					}
				,	doDelete :function ()
					{
						self.form.getForm ().reset ();
						self.form.loadRecord (this.selectedData[0]);
						self.form.doSave ();
					}
				,	onSelectionChange :function (model, data)
					{
						if (data.length > 0) {
							self.form.loadRecord (data[0]);
						}
					}
				});

			Ext.merge (cfg, opts.gridConfig);

			self.grid = Ext.create ("Jx.GridPaging", cfg);

			self.grid.on ("selectionchange", self.grid.onSelectionChange, self.grid);

			self.add (self.grid);
		}
//}}}
//{{{ form
	,	createForm : function (self, opts)
		{
			var id	= Jx.generateItemId (opts, "JxCardGridForm", "Form");
			var cfg	= {};

			Ext.merge (cfg, {
					itemId				:id
				,	_parent				:self
				,	store				:self.store
					// replace original save and cancel handler
				,	afterFormSave		:function (success)
					{
						if (success) {
							self.getLayout ().setActiveItem (self.grid);
						}
					}
				,	afterFormCancel		:function ()
					{
						self.getLayout ().setActiveItem (self.grid);
					}
				});

			Ext.merge (cfg, opts.formConfig);

			self.form = Ext.create ("Jx.Form", cfg);

			self.form.columnsToFields (opts.fields);

			self.add (this.form);
		}
//}}}
	}
//{{{ constructor
,	constructor	:function (cfg)
	{
		var opts = Ext.merge ({}, this.config);

		Ext.merge (opts, cfg);

		if (undefined === opts.id && undefined === opts.itemId) {
			opts.itemId = Jx.generateItemId (opts, "JxGridPagingFormEditor", "");
		}

		this.callParent ([opts]);
		this.initConfig (opts);

		Jx.CardGridForm.createStore (this, opts);
		Jx.CardGridForm.createGrid (this, opts);
		Jx.CardGridForm.createForm (this, opts);
	}
//}}}
,	doRefresh : function (perm)
	{
		this.perm = perm;
		this.grid.doRefresh (perm);
	}
});
