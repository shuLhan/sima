/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

Ext.define ("Jx.app.Asset.Viewer", {
	extend	:"Jx.GridPaging"
,	alias	:"widget.assetviewer"
,	config	:
	{
		title			:"Asset"
	,	store			:Jx.app.store.Asset
	,	showCrudButtons	:false
	,	columns			:
		[{
			header			:"Barcode"
		,	dataIndex		:"barcode"
		,	width			:130
		},{
			header			:"Type"
		,	dataIndex		:"type_id"
		,	renderer		:Jx.app.store.Asset.Type.renderData ("id", "name")
		,	flex			:true
		},{
			header			:"Merk"
		,	dataIndex		:"merk"
		,	flex			:true
		},{
			header			:"Model"
		,	dataIndex		:"model"
		,	flex			:true
		}]
	}

,	constructor	: function (config)
	{
		var opts = {};

		Ext.merge (opts, this.config);
		Ext.merge (opts, config);

		this.callParent ([opts]);
		this.initConfig (opts);
	}

,	doRefresh : function (perm)
	{
		this.store.load ();
		this.callParent ([perm]);
	}
});
