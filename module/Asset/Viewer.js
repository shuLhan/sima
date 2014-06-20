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
		,	width			:200
		},{
			header			:"Merk"
		,	dataIndex		:"merk"
		,	width			:200
		},{
			header			:"Model"
		,	dataIndex		:"model"
		,	width			:200
		}]
	}

,	constructor	: function (config)
	{
		var opts = {};

		Ext.merge (opts, this.config);
		Ext.merge (opts, config);

		this.callParent ([opts]);
	}

,	doRefresh : function (perm)
	{
		this.store.load ();
		this.callParent ([perm]);
	}
});

//# sourceURL=/module/Asset/Viewer.js
