/*
	Copyright 2014 - Mhd Sulhan
	Authors:
	- mhd.sulhan (m.shulhan@gmail.com)
*/

Ext.define ("Jx.app.Report.Procurement", {
	extend	:"Ext.panel.Panel"
,	config	:
	{
		perm		:0
	,	form		:undefined
	,	grid		:undefined

		// panel properties
	,	itemId		:"Report_Procurement"
	,	layout		:"border"
	,	title		:"Laporan Pengadaan Aset"
	,	closable	:true
	}

,	constructor : function (config)
	{
		var opts = {};
		Ext.merge (opts, this.config);
		Ext.merge (opts, config);
		this.callParent ([opts]);

		this.createGrid ();
		this.createForm ();
	}

,	createForm : function ()
	{
		var self = this;

		self.form				= Ext.create ("Jx.app.Report.Form", {
				region			:"west"
			,	split			:true
			,	width			:"30%"
			,	on_filter_click	:function ()
				{
					self.on_filter_click ()
				}
			});

		self.add (self.form);
	}

,	createGrid : function ()
	{
		var self = this;

		var store	= Ext.create ("Jx.app.store.Asset", {
				url	: Jx.generateModDir (self.itemId)
			});

		self.grid				= Ext.create ("Jx.app.Asset.Viewer", {
				region			:"center"
			,	store			:store
			,	showSearchField	:false
			,	showPagingBar	:false
			,	features		:
				[{
					ftype			:"summary"
				}]
			,	bbar			:
				["->"
				,{
					xtype			:"button"
				,	text			:"Print"
				,	iconCls			:"print"
				,	handler			:self.do_print
				,	scope			:self
				}]
			});

		self.add (self.grid);

		// additional columns
		var columns = [{
				header		:"Price"
			,	dataIndex	:"procurement_price"
			,	width		:120
			,	summaryType	:"sum"
			}];

		self.grid.headerCt.insert (self.grid.columns.length, columns);
		self.grid.getView ().refresh ();
	}

,	on_filter_click : function (b)
	{
		var params = this.form.getValues ();

		Ext.merge (this.grid.store.proxy.extraParams, params);

		this.grid.store.load ();
	}

,	do_print : function (b)
	{
		var self	= this;
		var dir		= Jx.generateModDir (this.itemId);
		var form	= self.form.getForm ();

		form.standardSubmit = true;

		form.submit ({
				target	:"_blank"
			,	url		:dir +"print.php"
			});
	}

,	doRefresh : function (perm)
	{
		var self = this;

		self.perm = perm;

		Jx.chainStoreLoad (
				[
					Jx.app.store.Asset.Type
				]
			,	function ()
				{
					self.grid.clearData ();
				}
			,	0
			);
	}
});

var Report_Procurement = Ext.create ("Jx.app.Report.Procurement");

//# sourceURL=module/Report/Procurement/layout.js
