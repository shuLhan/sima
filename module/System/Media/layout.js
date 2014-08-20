/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
Ext.define ("Jx.app.System.Media", {
	extend		:"Jx.GridPaging.FormEditor"
,	config		:
	{
		itemId		:"System_Media"
	,	title		:"System Media"
	,	store		:Ext.create ("Jx.StoreRest",
		{
			url			:Jx.generateModDir ("System_Media")
		,	fields		:
			[
				"_profile_id"
			,	"id"
			,	"name"
			,	"extension"
			,	"size"
			,	"mime"
			,	"description"
			,	"path"
			]
		})
	,	formConfig	:
		{
			syncUseStore	:false
		}
	,	columns		:
		[{
			header		:"Profile ID"
		,	dataIndex	:"_profile_id"
		,	hidden		:true
		,	editor		:
			{
				hidden		:true
			}
		},{
			header		:"ID"
		,	dataIndex	:"id"
		,	hidden		:true
		,	editor		:
			{
				xtype		:"textfield"
			,	hidden		:true
			}
		},{
			header		:"Name"
		,	dataIndex	:"name"
		,	editor		:
			{
				xtype		:"textfield"
			}
		},{
			header		:"Extension"
		,	dataIndex	:"extension"
		,	editor		:
			{
				xtype		:"textfield"
			,	hidden		:true
			}
		},{
			header		:"Size"
		,	dataIndex	:"size"
		,	hidden		:true
		,	editor		:
			{
				xtype		:"numberfield"
			,	hidden		:true
			}
		},{
			header		:"Mime"
		,	dataIndex	:"mime"
		,	editor		:
			{
				xtype		:"textfield"
			,	hidden		:true
			}
		},{
			header		:"Description"
		,	dataIndex	:"description"
		,	flex		:1
		,	editor		:
			{
				xtype		:"textarea"
			}
		},{
			header		:"Path"
		,	dataIndex	:"path"
		,	hidden		:true
		,	editor		:
			{
				xtype		:"textfield"
			,	hidden		:true
			}
		},{
			header		:"Content"
		,	dataIndex	:"content"
		,	hidden		:true
		,	editor		:
			{
				xtype		:"filefield"
			,	itemId		:"content"
			,	buttonText	:"Select File"
			,	editable	:false
			}
		}]
	}
});

var System_Media = Ext.create ("Jx.app.System.Media");

//# sourceURL=module/System/Media/layout.js
