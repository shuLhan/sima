/*
	Copyright 2014 - Mhd Sulhan
	Authors:
	- mhd.sulhan (m.shulhan@gmail.com)
*/

Ext.define ("Jx.app.Report.Disposal", {
	extend	:"Ext.panel.Panel"
,	config	:
	{
		perm		:0
	,	form		:undefined
	,	grid		:undefined

		// panel properties
	,	itemId		:"Report_Disposal"
	,	layout		:"border"
	,	title		:"Laporan Penghapusan Aset"
	,	closable	:true
	}
//{{{ constructor
,	constructor : function (config)
	{
		var opts = {};
		Ext.merge (opts, this.config);
		Ext.merge (opts, config);
		this.callParent ([opts]);

		this.createGrid ();
		this.createForm ();
	}
//}}}
//{{{ panel: filter
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

		self.form.down ("#filter_date").setTitle ("Disposal Date");

		self.add (self.form);
	}
//}}}
//{{{ panel: grid
,	createGrid : function ()
	{
		var self = this;

		var store		= Ext.create ("Jx.StoreRest", {
				url		: Jx.generateModDir ("Asset_Removal")
			,	fields	:
				[
					"asset_id"
				,	"type_id"
				,	"merk"
				,	"model"
				,	"barcode"
				,	"asset_removal_id"
				,	"removal_cost"
				,	"removal_info"
				,{
					name		:"removal_date"
				,	type		:"date"
				,	dateFormat	:"c"
				}]
			});

		self.grid				= Ext.create ("Jx.GridPaging", {
				region			:"center"
			,	store			:store
			,	showSearchField	:false
			,	showPagingBar	:false
			,	features		:
				[{
					ftype			:"summary"
				}]
			,	columns 		:
				[{
					header			:"Barcode"
				,	dataIndex		:"barcode"
				,	width			:130
				},{
					header			:"Type"
				,	dataIndex		:"type_id"
				,	renderer		:Jx.app.store.Asset.Type.renderData ("id", "name")
				,	width			:200
				},{
					header			:"Merk"
				,	dataIndex		:"merk"
				,	width			:200
				},{
					header			:"Model"
				,	dataIndex		:"model"
				,	width			:200
				},{
					header			:"Jenis Penghapusan"
				,	dataIndex		:"asset_removal_id"
				,	renderer		:Jx.app.store.Asset.Removal.renderData ("id", "name")
				,	width			:150
				},{
					header			:"Date"
				,	xtype			:"datecolumn"
				,	dataIndex		:"removal_date"
				,	format			:"d M Y"
				,	width			:150
				},{
					header			:"Description"
				,	dataIndex		:"removal_info"
				,	width			:200
				},{
					header			:"Cost"
				,	xtype			:"numbercolumn"
				,	dataIndex		:"removal_cost"
				,	summaryType		:"sum"
				,	width			:150
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
	}
//}}}
//{{{ function : on filter click
,	on_filter_click : function (b)
	{
		var params = this.form.getValues ();

		Ext.merge (this.grid.store.proxy.extraParams, params);

		this.grid.store.load ();
	}
//}}}
//{{{ function : do print
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
//}}}
//{{{ function : do refresh
,	doRefresh : function (perm)
	{
		var self = this;

		self.perm = perm;

		Jx.chainStoreLoad (
				[
					Jx.app.store.Asset.Type
				,	Jx.app.store.Asset.Removal
				]
			,	function ()
				{
					self.grid.clearData ();
				}
			,	0
			);
	}
//}}}
});

var Report_Disposal = Ext.create ("Jx.app.Report.Disposal");

//# sourceURL=module/Report/Disposal/layout.js
