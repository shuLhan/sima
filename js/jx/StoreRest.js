/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)

	Custom store with REST and JSON.
*/
Ext.define ("Jx.StoreRest", {
	extend		:"Ext.data.Store"
,	alias		:"jx.storerest"
,	autoLoad	:false
,	autoSync	:false
,	autoDestroy	:true
,	config		:
	{
		pageSize	:Jx.pageSize
	,	idProperty	:"id"
	,	proxy		:
		{
			type		:"rest"
		,	appendId	:false
		,	extraParams	:
			{
				query		:""
			}
		,	reader		:
			{
				type		:"json"
			,	root		:"data"
			}
		,	writer		:
			{
				type		:"json"
			,	allowSingle	:false
			}
		}
	}

,	constructor	:function (config)
	{
		var opts = Ext.merge ({}, this.config);

		Ext.merge (opts, config);

		this.callParent ([opts]);
	}

,	getIdProperty	:function ()
	{
		return this.model.prototype.idProperty;
	}

});
