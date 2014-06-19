/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxAssetMaintenance ()
{
	this.id		= "Asset_Maintenance";
	this.dir	= Jx.generateModDir (this.id);

//{{{ fields
	this.fields		= [{
			header		:"ID"
		,	dataIndex	:"id"
		,	hidden		:true
		,	type		:"int"
		,	editor		:
			{
				hidden	:true
			}
		},{
			header		:"Asset ID"
		,	dataIndex	:"asset_id"
		,	hidden		:true
		,	type		:"int"
		,	editor		:
			{
				hidden		:true
			}
		},{
			header		:"Date"
		,	xtype		:"datecolumn"
		,	dataIndex	:"maintenance_date"
		,	format		:"d M Y"
		,	editor		:
			{
				xtype		:"datefield"
			,	format		:"d M Y"
			,	submitFormat:"Y-m-d"
			}
		},{
			header		:"Cost"
		,	dataIndex	:"cost"
		,	type		:"float"
		,	editor		:
			{
				xtype		:"numberfield"
			,	minValue	:0
			}
		},{
			header		:"Status"
		,	dataIndex	:"asset_status_id"
		,	renderer	:Jx.app.store.Asset.Status.renderData ("id", "name")
		,	editor		:
			{
				xtype			:"combobox"
			,	store			:Jx.app.store.Asset.Status
			,	valueField		:"id"
			,	displayField	:"name"
			}
		},{
			header		:"Description"
		,	dataIndex	:"maintenance_info"
		,	flex		:true
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

				Asset_Maintenance.panelAssetMaintenanceLog.doReload (this.perm, id);
			}
		});
//}}}
//{{{ panel: asset maintenance log
	this.panelAssetMaintenanceLog = Ext.create ("Jx.CardGridForm", {
			title			:"Riwayat Pemeliharaan"
		,	url				:this.dir
		,	closable		:false
		,	region			:"east"
		,	width			:"50%"
		,	split			:true
		,	collapsible		:true
		,	fields			:this.fields
		,	gridConfig		:
			{
				showCrudButtons	:true
			,	showPagingBar	:false
			}

		,	doReload	: function (perm, id)
			{
				if (id <= 0) {
					this.store.removeAll ();
				} else {
					this.store.proxy.extraParams.asset_id = id;
					this.doRefresh (perm);
				}
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
		,	title		:"Pemeliharaan Aset"
		,	closable	:true
		,	items		:
			[
				this.panelAsset
			,	this.panelAssetMaintenanceLog
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
				,	Jx.app.store.Asset
				]
			,	function ()
				{
					self.perm = perm;
					self.panelAsset.doRefresh (perm);
					self.panelAssetMaintenanceLog.doReload (perm, 0);
				}
			,	0);
	};
//}}}
}

var Asset_Maintenance = new JxAssetMaintenance ();

//# sourceURL=module/Asset/Maintenance/layout.js
