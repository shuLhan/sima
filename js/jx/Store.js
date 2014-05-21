/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)

	Custom store with AJAX and JSON.
*/
var storeDefaultConfig = {
	autoLoad		:false
,	autoSync		:false
,	autoDestroy		:true
,	proxy			:
	{
		type			:"ajax"
	,	url				:""
	,	filterParam		:undefined
	,	extraParams		:
		{
			action			:"read"
		,	query			:""
		,	subaction		:""
		}
	,	reader			:
		{
			type			:"json"
		,	root			:"data"
		}
	,	writer			:
		{
			type			:"json"
		,	allowSingle		:false
		,	writeRecordId	:false
		}
	}

	// store's current action (read, create, update, destroy).
,	action		:"read"
,	singleApi	:true
,	extension	:_g_ext
,	idProperty	:"id"

,	api			:
	{
		read		:"read"
	,	create		:"create"
	,	update		:"update"
	,	destroy		:"destroy"
	}

,	storeInit :function ()
	{
		this.rebuildUrl ();

		/* Check and merge for extra parameters */
		if (this.extraParams && typeof (this.extraParams) === "object") {
			Ext.merge (this.proxy.extraParams, this.extraParams);
		}

		/* Set idProperty */
		this.model.prototype.idProperty = this.idProperty;
	}

,	rebuildUrl	:function ()
	{
		if (this.url) {
			if (this.singleApi) {
				this.proxy.api = {
						read	:this.url
					,	create	:this.url
					,	update	:this.url
					,	destroy	:this.url
					};
			} else {
				this.proxy.api = {
						read	:this.url + this.api.read		+ this.extension
					,	create	:this.url + this.api.create		+ this.extension
					,	update	:this.url + this.api.update 	+ this.extension
					,	destroy	:this.url + this.api.destroy	+ this.extension
					};
			}
		} else if (this.api) {
			this.proxy.api = this.api;
		}
	}

,	getIdProperty	:function ()
	{
		return this.model.prototype.idProperty;
	}
};

Ext.define ("Jx.Store", {
	extend	:"Ext.data.Store"
,	alias	:"jx.store"
,	config	:
	{
		remoteFilter	:true
	,	pageSize		:Jx.pageSize
	}
,	constructor	:function (config)
	{
		var opts = {};

		Ext.merge (opts, storeDefaultConfig);
		Ext.merge (opts, this.config);
		Ext.merge (opts, config);

		this.callParent ([opts]);
		this.initConfig (opts)

		this.storeInit ();
	}
});

/**
 * Store with RESTful.
 */
Ext.define ("Jx.StoreRest", {
	extend		:"Jx.Store"
,	alias		:"jx.storerest"
,	config		:
	{
		proxy		:
		{
			type		:"rest"
		,	appendId	:false
		}
	}
,	constructor	:function (config)
	{
		var opts = Ext.merge ({}, this.config);

		Ext.merge (opts, config);

		this.callParent ([opts]);
	}
});

/*
	Custom store tree with REST + JSON.
*/
Ext.define ("Jx.StoreTree", {
	extend				:"Ext.data.TreeStore"
,	alias				:"jx.storetree"
,	config				:
	{
		defaultRootProperty	:"children"
	,	root				:
		{
			text				:""
		,	expanded			:true
		,	children			:[]
		}
	,	proxy				:
		{
			type				:"rest"
		,	appendId			:false
		,	reader			:
			{
				type			:"json"
			,	root			:"children"
			}
		}
	}

,	constructor	:function (config)
	{
		var opts = {};

		Ext.merge (opts, storeDefaultConfig);
		Ext.merge (opts, this.config);
		Ext.merge (opts, config);

		this.callParent ([opts]);
		this.initConfig (opts)

		this.storeInit ();
	}
});
