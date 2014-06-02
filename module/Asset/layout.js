/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxAsset ()
{
	this.id		= "Asset";
	this.dir	= Jx.generateModDir (this.id);

	this.storeAssetType	= Ext.create ("Jx.StoreRest", {
			url			:Jx.generateModDir ("Reference_Asset_Type")
		,	fields		:
			[{
				name	:"id"
			,	type	:"int"
			},{
				name	:"name"
			}]
		});

	this.storeAssetProcurement	= Ext.create ("Jx.StoreRest", {
			url					:Jx.generateModDir ("Reference_Asset_Procurement")
		,	fields				:
			[{
				name	:"id"
			,	type	:"int"
			},{
				name	:"name"
			}]
		});

	this.storeAssetStatus	= Ext.create ("Jx.StoreRest", {
			url				:Jx.generateModDir ("Reference_Asset_Status")
		,	fields				:
			[{
				name	:"id"
			,	type	:"int"
			},{
				name	:"name"
			}]
		});

	this.storeSystemUser	= Ext.create ("Jx.StoreRest", {
			url				:Jx.generateModDir ("System_User")
		,	fields				:
			[{
				name	:"id"
			,	type	:"int"
			},{
				name	:"realname"
			}]
		});

	this.storeAssetLocation	= Ext.create ("Jx.StoreRest", {
			url				:Jx.generateModDir ("Reference_Asset_Location")
		,	fields			:
			[{
				name	:"id"
			,	type	:"int"
			},{
				name	:"name"
			}]
		});

	this.fields	=
		[{
			header		:"Master Data"
		,	columns		:
			[{
				header		:"ID"
			,	dataIndex	:"id"
			,	type		:"int"
			,	hidden		:true
			,	editor		:
				{
					hidden		:true
				}
			},{
				header		:"Type"
			,	dataIndex	:"type_id"
			,	type		:"int"
			,	renderer	:this.storeAssetType.renderData ("id", "name")
			,	editor		:
				{
					xtype			:"combobox"
				,	store			:this.storeAssetType
				,	allowBlank		:false
				,	valueField		:"id"
				,	displayField	:"name"
				}
			},{
				header		:"Merk"
			,	dataIndex	:"merk"
			,	editor		:{}
			},{
				header		:"Model"
			,	dataIndex	:"model"
			,	editor		:{}
			},{
				header		:"SN"
			,	dataIndex	:"sn"
			,	hidden		:true
			,	editor		:{}
			},{
				header		:"Barcode"
			,	dataIndex	:"barcode"
			,	hidden		:true
			,	editor		:{}
			},{
				header		:"Service Tag"
			,	dataIndex	:"service_tag"
			,	hidden		:true
			,	editor		:{}
			},{
				header		:"Label Tag"
			,	dataIndex	:"label"
			,	hidden		:true
			,	editor		:{}
			},{
				header		:"Detil"
			,	dataIndex	:"detail"
			,	hidden		:true
			,	editor		:
				{
					xtype		:"textarea"
				}
			}]
		},{
			header		:"Garansi"
		,	columns		:
			[{
				header		:"Tanggal Pembelian"
			,	dataIndex	:"warranty_date"
			,	width		:140
			,	xtype		:"datecolumn"
			,	format		:"d M Y"
			,	editor		:
				{
					xtype		:"datefield"
				,	format		:"d M Y"
				}
			},{
				header		:"Lama Garansi"
			,	dataIndex	:"warranty_length"
			,	hidden		:true
			,	editor		:
				{
					xtype			:"numberfield"
				,	minValue		:0
				,	allowDecimals	:false
				}
			},{
				header		:"Info Garansi"
			,	dataIndex	:"warranty_info"
			,	hidden		:true
			,	editor		:
				{
					xtype		:"textarea"
				}
			}]
		},{
			header		:"Pengadaan"
		,	hidden		:true
		,	columns		:
			[{
				header		:"Jenis"
			,	dataIndex	:"procurement_id"
			,	type		:"int"
			,	hidden		:true
			,	editor		:
				{
					xtype			:"combobox"
				,	store			:this.storeAssetProcurement
				,	valueField		:"id"
				,	displayField	:"name"
				}
			},{
				header		:"Perusahaan / Toko"
			,	dataIndex	:"company"
			,	hidden		:true
			,	editor		:{}
			},{
				header		:"Harga"
			,	dataIndex	:"price"
			,	hidden		:true
			,	editor		:
				{
					xtype		:"numberfield"
				,	minValue	:0
				}
			}]
		},{
			header		:"Penggunaan"
		,	columns		:
			[{
				header		:"Status"
			,	dataIndex	:"status_id"
			,	type		:"int"
			,	renderer	:this.storeAssetStatus.renderData ("id", "name")
			,	editor		:
				{
					xtype			:"combobox"
				,	store			:this.storeAssetStatus
				,	valueField		:"id"
				,	displayField	:"name"
				}
			},{
				header		:"Pengguna"
			,	dataIndex	:"_user_id"
			,	type		:"int"
			,	hidden		:true
			,	editor		:
				{
					xtype			:"combobox"
				,	store			:this.storeSystemUser
				,	valueField		:"id"
				,	displayField	:"realname"
				}
			},{
				header		:"Lokasi"
			,	dataIndex	:"location_id"
			,	type		:"int"
			,	renderer	:this.storeAssetLocation.renderData ("id", "name")
			,	editor		:
				{
					xtype			:"combobox"
				,	store			:this.storeAssetLocation
				,	valueField		:"id"
				,	displayField	:"name"
				}
			},{
				header		:"Detil Lokasi"
			,	dataIndex	:"location_detail"
			,	hidden		:true
			,	editor		:{}
			},{
				header		:"Info Perawatan"
			,	dataIndex	:"maintenance_info"
			,	hidden		:true
			,	editor		:
				{
					xtype		:"textarea"
				}
			}]
		}];

	this.panel			= Ext.create ("Jx.CardGridForm", {
			itemId		:this.id
		,	url			:this.dir
		,	fields		:this.fields
		,	title		:"Aset"
		,	formConfig	:
			{
				layout		:
				{
					type			:"column"
				}
			,	defaults	:
				{
					margin		:10
				,	width		:300
				}
			}
		});

	this.doRefresh	= function (perm)
	{
		var self = this;

		Jx.chainStoreLoad (
				[
					this.storeAssetType
				,	this.storeAssetProcurement
				,	this.storeAssetStatus
				,	this.storeAssetLocation
				,	this.storeSystemUser
				]
			,	function ()
				{
					self.panel.doRefresh (perm);
				}
			,	0);
	};
};

var Asset = new JxAsset ();

//# sourceURL=module/Reference/Asset/Location/layout.js
