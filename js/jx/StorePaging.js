/*
	Copyright 2013 - x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)

	Custom store for Jx.GridPaging with AJAX, JSON, paging, and searching capability.
*/
Ext.define ("Jx.StorePaging", {
	extend		:"Jx.Store"
,	alias		:"jx.storepaging"
,	config		:
	{
		remoteFilter:true
	,	pageSize	:Jx.pageSize
	,	fieldId		:"id"		// used later by GridPaging.compDetails.
	}

,	constructor	:function (config)
	{
		this.callParent (arguments);
		this.initConfig (config);
	}

,	getFieldId	:function ()
	{
		return this.fieldId
	}
});
