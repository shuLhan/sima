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
,	closable	:true
,	config		:
	{
		itemId		:""
	,	url			:""
	,	store		:undefined
	,	fields		:[]
	,	grid		:undefined
	,	form		:undefined
	}

,	statics		:
	{
		createStore : function (self, opts)
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
						f	= {};

						if (undefined !== cc.dataIndex) {
							f.name = cc.dataIndex;

							if (undefined !== cc.type) {
								f.type = cc.type;
								delete cc.type; // unneeded anymore.
							}

							fields.push (f);
						}
					}
				} else {
					if (undefined !== c.dataIndex) {
						f.name = c.dataIndex;

						if (undefined !== c.type) {
							f.type = c.type;
							delete c.type; // unneeded anymore.
						}

						fields.push (f);
					}
				}
			}

			self.store		= Ext.create ("Jx.StoreRest", {
					url		: opts.url
				,	fields	: fields
				});
		}

	,	createGrid : function (self, opts)
		{
			var barName		= "Grid";
			var id			= ( opts.id
							? opts.id + barName
							: ( opts.itemId
								? opts.itemId + barName
								: "JxCardGridForm"+ barName));

			/* Add row number to grid */
			opts.fields.splice (0, 0, { xtype : "rownumberer" });

			self.grid				= Ext.create ("Jx.GridPaging", {
					itemId			: id
				,	_parent			: self
				,	store			: self.store
				,	columns			: opts.fields
				,	region			:"center"

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

			self.grid.on ("selectionchange", self.grid.onSelectionChange, self.grid);

			self.add (self.grid);
		}

	,	createForm : function (self, opts)
		{
			var barName		= "Form";
			var id			= ( opts.id
							? opts.id + barName
							: ( opts.itemId
								? opts.itemId + barName
								: "JxCardGridForm"+ barName));

			var cfg = {};

			Ext.merge (cfg, {
					itemId				:id
				,	store				:self.store
				,	afterSaveSuccess	:function ()
					{
						self.getLayout ().setActiveItem (self.grid);
					}

				,	afterFormCancel		:function ()
					{
						self.getLayout ().setActiveItem (self.grid);
					}
				});

			Ext.merge (cfg, opts.formConfig);

			self.form	= Ext.create ("Jx.Form", cfg);

			self.form.columnsToFields (opts.fields);

			self.add (this.form);
		}
	}

,	constructor	:function (cfg)
	{
		var opts = {};

		Ext.merge (opts, this.config);
		Ext.merge (opts, cfg);

		this.callParent ([opts]);
		this.initConfig (opts);

		this.self.createStore (this, opts);
		this.self.createGrid (this, opts);
		this.self.createForm (this, opts);
	}

,	doRefresh : function (perm)
	{
		this.grid.doRefresh (perm);
	}
});
