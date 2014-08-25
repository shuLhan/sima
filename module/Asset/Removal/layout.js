/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxAssetRemoval ()
{
	this.id		= "Asset_Removal";
	this.dir	= Jx.generateModDir (this.id);

//{{{ fields
	this.fields		= [{
			header		:"Asset ID"
		,	dataIndex	:"asset_id"
		,	hidden		:true
		,	type		:"int"
		,	editor		:
			{
				hidden		:true
			}
		},{
			header		:"Jenis Penghapusan"
		,	dataIndex	:"asset_removal_id"
		,	renderer	:Jx.app.store.Asset.Removal.renderData ("id", "name")
		,	width		:150
		,	editor		:
			{
				xtype			:"combobox"
			,	store			:Jx.app.store.Asset.Removal
			,	valueField		:"id"
			,	displayField	:"name"
			}
		},{
			header		:"Barcode"
		,	dataIndex	:"barcode"
		,	width		:130
		},{
			header		:"Type"
		,	dataIndex	:"type_id"
		,	renderer	:Jx.app.store.Asset.Type.renderData ("id", "name")
		,	width		:150
		},{
			header		:"Merk"
		,	dataIndex	:"merk"
		,	width		:150
		},{
			header		:"Model"
		,	dataIndex	:"model"
		,	width		:150
		},{
			header		:"Date"
		,	xtype		:"datecolumn"
		,	dataIndex	:"removal_date"
		,	format		:"d M Y"
		,	editor		:
			{
				xtype		:"datefield"
			,	format		:"d M Y"
			,	submitFormat:"Y-m-d"
			}
		},{
			header		:"Cost"
		,	dataIndex	:"removal_cost"
		,	type		:"float"
		,	editor		:
			{
				xtype		:"numberfield"
			,	minValue	:0
			}
		},{
			header		:"Description"
		,	dataIndex	:"removal_info"
		,	editor		:
			{
				xtype		:"textarea"
			}
		}];
//}}}
//{{{ panel: asset
	this.panelAsset				= Ext.create ("Jx.app.Asset.Viewer", {
			itemId				:this.id +"_Asset"
		,	region				:"center"
		,	onSelectionChange	: function (model, data)
			{
				var id = 0;

				if (data.length > 0) {
					id = data[0].get ("id");
				}

				Asset_Removal.panelAssetRemovalLog.doReload (this.perm, id);
			}
		});
//}}}
//{{{ panel: asset removal log
	this.panelAssetRemovalLog = Ext.create ("Jx.CardGridForm", {
			title			:"History of Disposal"
		,	url				:this.dir
		,	region			:"east"
		,	width			:"50%"
		,	split			:true
		,	collapsible		:true
		,	fields			:this.fields
		,	closable		:false
		,	gridConfig		:
			{
				showCrudButtons	:true
			}
		,	formConfig		:
			{
				defaults	:
				{
					labelWidth		:120
				}
			}

		,	doReload	: function (perm, id)
			{
				this.store.proxy.extraParams.asset_id = id;
			}

		,	afterAdd : function ()
			{
				this.form.getForm ().setValues ({
					"asset_id" : this.store.proxy.extraParams.asset_id
				});
			}
		});
//}}}
//{{{ panel: main
	this.panel			= Ext.create ("Ext.container.Container", {
			layout		:"border"
		,	title		:"Asset Disposal"
		,	closable	:true
		,	items		:
			[
				this.panelAsset
			,	this.panelAssetRemovalLog
			]
		});
//}}}
//{{{ refresh this module
	this.doRefresh	= function (perm)
	{
		var self = this;

		Jx.chainStoreLoad (
				[
					Jx.app.store.System.User
				,	Jx.app.store.Asset.Type
				,	Jx.app.store.Asset.Procurement
				,	Jx.app.store.Asset.Status
				,	Jx.app.store.Asset.Location
				,	Jx.app.store.Asset.Removal
				,	Jx.app.store.Asset
				]
			,	function ()
				{
					self.perm = perm;
					self.panelAsset.doRefresh (perm);
					self.panelAssetRemovalLog.doRefresh (perm);
				}
			,	0);
	};
//}}}
}

var Asset_Removal = new JxAssetRemoval ();

//# sourceURL=module/Asset/Removal/layout.js
