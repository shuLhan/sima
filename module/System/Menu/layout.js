/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
Ext.define ("Jx.app.System.Menu", {
	extend	:"Jx.GridPaging.FormEditor"
,	config	:
	{
		itemId	:"System_Menu"
	,	title	:"System Menu"
	,	store	: Ext.create ("Jx.StoreRest"
		,	{
				url			:Jx.generateModDir ("System_Menu")
			,	idProperty	:""
			,	fields		:
				[
					"_profile_id"
				,	"id"
				,	"pid"
				,	"type"
				,	"label"
				,	"icon"
				,	"image"
				,	"module"
				,	"description"
				]
			})

	,	columns		:
		[{
			header		:"Profile ID"
		,	dataIndex	:"_profile_id"
		,	hidden		:true
		,	editor		:
			{
				itemId		:"_profile_id"
			}
		},{
			header		:"ID"
		,	dataIndex	:"id"
		,	editor		:
			{
				xtype			:"numberfield"
			,	minValue		:0
			,	allowDecimals	:false
			}
		},{
			header		:"PID"
		,	dataIndex	:"pid"
		,	editor		:
			{
				xtype			:"numberfield"
			,	minValue		:0
			,	allowDecimals	:false
			}
		},{
			header		:"Type"
		,	dataIndex	:"type"
		,	editor		:
			{
				xtype			:"numberfield"
			,	minValue		:0
			,	maxValue		:3
			,	allowDecimals	:false
			}
		},{
			header		:"Label"
		,	dataIndex	:"label"
		,	width		:200
		,	editor		:{}
		},{
			header		:"Icon"
		,	dataIndex	:"icon"
		,	width		:140
		,	editor		:{}
		},{
			header		:"Image"
		,	dataIndex	:"image"
		,	width		:200
		,	editor		:{}
		},{
			header		:"Module"
		,	dataIndex	:"module"
		,	width		:200
		,	editor		:{}
		},{
			header		:"Description"
		,	dataIndex	:"description"
		,	width		:300
		,	editor		:
			{
				xtype		:"textarea"
			}
		}]
	}
});

var System_Menu = Ext.create ("Jx.app.System.Menu");

//# sourceURL=module/System/Menu/layout.js
