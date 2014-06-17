/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
Ext.Loader.setPath ("Jx.Media.Table", "/module/System/Media/Table");

function JxAsset ()
{
	this.id		= "Asset";
	this.dir	= Jx.generateModDir (this.id);
//{{{ fields
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
				header		:"Media ID"
			,	dataIndex	:"table_id"
			,	hidden		:true
			,	editor		:
				{
					hidden		:true
				}
			},{
				header		:"Type"
			,	dataIndex	:"type_id"
			,	type		:"int"
			,	renderer	:Jx.app.store.Asset.Type.renderData ("id", "name")
			,	editor		:
				{
					xtype			:"combobox"
				,	store			:Jx.app.store.Asset.Type
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
			,	editor		:
				{
					disabled	:true
				}
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
				header		:"Detail"
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
				header		:"Tanggal Beli"
			,	dataIndex	:"warranty_date"
			,	width		:140
			,	xtype		:"datecolumn"
			,	format		:"d M Y"
			,	editor		:
				{
					xtype		:"datefield"
				,	format		:"d M Y"
				,	submitFormat:"Y-m-d"
				}
			},{
				header		:"Lama (tahun)"
			,	dataIndex	:"warranty_length"
			,	hidden		:true
			,	editor		:
				{
					xtype			:"numberfield"
				,	minValue		:0
				,	allowDecimals	:false
				}
			},{
				header		:"Informasi"
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
			,	renderer	:Jx.app.store.Asset.Procurement.renderData ("id", "name")
			,	hidden		:true
			,	editor		:
				{
					xtype			:"combobox"
				,	store			:Jx.app.store.Asset.Procurement
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
				header		:"Pengguna"
			,	dataIndex	:"_user_id"
			,	renderer	:Jx.app.store.System.User.renderData ("id", "realname")
			,	editor		:
				{
					xtype			:"combobox"
				,	store			:Jx.app.store.System.User
				,	valueField		:"id"
				,	displayField	:"realname"
				,	readOnly		:true
				}
			},{
				header		:"Lokasi"
			,	dataIndex	:"location_id"
			,	renderer	:Jx.app.store.Asset.Location.renderData ("id", "name")
			,	editor		:
				{
					xtype			:"combobox"
				,	store			:Jx.app.store.Asset.Location
				,	valueField		:"id"
				,	displayField	:"name"
				,	readOnly		:true
				}
			},{
				header		:"Detil Lokasi"
			,	dataIndex	:"location_detail"
			,	hidden		:true
			,	editor		:
				{
					xtype		:"textarea"
				,	readOnly	:true
				}
			}]
		},{
			header	:"Pemeliharaan"
		,	columns	:
			[{
				header		:"Status"
			,	dataIndex	:"asset_status_id"
			,	renderer	:Jx.app.store.Asset.Status.renderData ("id", "name")
			,	editor		:
				{
					xtype			:"combobox"
				,	store			:Jx.app.store.Asset.Status
				,	valueField		:"id"
				,	displayField	:"name"
				,	readOnly		:true
				}
			},{
				header		:"Biaya"
			,	dataIndex	:"maintenance_cost"
			,	editor		:
				{
					xtype		:"displayfield"
				}
			},{
				header		:"Info Perawatan"
			,	dataIndex	:"maintenance_info"
			,	hidden		:true
			,	editor		:
				{
					xtype		:"textarea"
				,	readOnly	:true
				}
			}]
		}];
//}}}
//{{{ media viewer
	this.mediaViewer	= Ext.create ("Jx.Media.Table.Viewer",{
			region		:"east"
		,	split		:true
		,	width		:"30%"
		,	table_name	:"asset"
		,	collapsible	:true
		});
//}}}
//{{{ panel: asset
	this.cardPanel		= Ext.create ("Jx.CardGridForm", {
			itemId		:this.id
		,	url			:this.dir
		,	fields		:this.fields
		,	closable	:false
		,	region		:"center"
		,	formConfig	:
			{
				layout		:
				{
					type		:"column"
				}
			,	defaults	:
				{
					margin		:14
				,	width		:340
				}
			,	listeners	:{
					canceled: function ()
					{
						Asset.mediaViewer.hide ();
					}
				,	savesuccess: function ()
					{
						Asset.mediaViewer.hide ();
					}
				}
			}
		,	gridConfig	:
			{
				plugins	:
				[{
					ptype		:"copybutton"
				},{
					ptype		:"importbutton"
				,	importUrl	:this.dir +"import.php"
				}]

			,	afterSelectionChange : function (model, data)
				{
					var id = 0;

					if (data.length > 0) {
						id = data[0].get ("table_id");
					}

					Asset.mediaViewer.doRefresh (Asset.perm, id);
				}
			,	afterAdd : function ()
				{
					var id = Ext.id (null, "asset-");

					Asset.cardPanel.form.getForm ().setValues ({ table_id : id });
					Asset.mediaViewer.show (id);
					Asset.mediaViewer.doRefresh (Asset.perm, id);
				}
			,	afterEdit : function ()
				{
					var id = this.selectedData[0].get ("table_id");

					if (null === id) {
						id = Ext.id (null, "asset-");
						Asset.cardPanel.form.getForm ().setValues ({ table_id : id });
					}

					Asset.mediaViewer.show (id);
				}
			}
		});
//}}}
//{{{ main panel
	this.panel			= Ext.create ("Ext.container.Container", {
			itemId		:this.id
		,	title		:"Aset"
		,	closable	:true
		,	layout		:"border"
		,	items		:
			[
				this.cardPanel
			,	this.mediaViewer
			]
		});
//}}}
//{{{ refresh
	this.doRefresh	= function (perm)
	{
		var self = this;

		Jx.chainStoreLoad (
				[
					Jx.app.store.Asset.Type
				,	Jx.app.store.Asset.Procurement
				,	Jx.app.store.Asset.Status
				,	Jx.app.store.Asset.Location
				,	Jx.app.store.System.User
				]
			,	function ()
				{
					self.perm = perm;
					self.mediaViewer.doRefresh (perm, 0);
					self.cardPanel.doRefresh (perm);
				}
			,	0);
	};
//}}}
};

var Asset = new JxAsset ();

//# sourceURL=module/Asset/layout.js
