/*
	Copyright 2014 - Mhd Sulhan
	Authors:
	- mhd.sulhan (m.shulhan@gmail.com)
*/

Ext.define ("Jx.app.Report.Form", {
	extend		:"Ext.form.Panel"
,	defaults	:
	{
		labelAlign	:"right"
	,	anchor		:"100%"
	}
,	config		:
	{
		title		:"Data Filter"
	,	titleAlign	:"center"
	,	layout		:"anchor"
	,	bodyPadding	:10
	,	bodyStyle	:'border:0px;'
	,	items		:
		[{
			xtype			:"combobox"
		,	fieldLabel		:"Asset Type"
		,	store			:Jx.app.store.Asset.Type
		,	valueField		:"id"
		,	displayField	:"name"
		,	name			:"asset_type_id"
		},{
			xtype			:"fieldset"
		,	title			:"Purchase Date"
		,	layout			:"anchor"
		,	defaults		:
			{
				anchor			:"100%"
			,	labelAlign		:"right"
			}
		,	items			:
			[{
				xtype			:"datefield"
			,	fieldLabel		:"From"
			,	name			:"date_from"
			,	format			:"d M Y"
			,	submitFormat	:"Y-m-d"
			,	value			:new Date ()
			,	editable		:false
			,	allowBlank		:false
			},{
				xtype			:"datefield"
			,	fieldLabel		:"To"
			,	name			:"date_to"
			,	format			:"d M Y"
			,	submitFormat	:"Y-m-d"
			,	value			:new Date ()
			,	editable		:false
			,	allowBlank		:false
			}]
		}]
	,	buttons		:
		[{
			itemId		:"bfilter"
		,	text		:"Filter"
		,	formBind	:true
		}]
	}

,	constructor : function (config)
	{
		var opts = {};

		Ext.merge (opts, this.config);
		Ext.merge (opts, config);

		this.callParent ([opts]);

		this.down ("#bfilter").on ("click", this.on_filter_click, this);
	}

	// override this
,	on_filter_click : function () {}
});
