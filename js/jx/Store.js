/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)

	Custom store with AJAX and JSON.
*/
Ext.define ("Jx.base.Store", {
	autoLoad			:false
,	autoSync			:false
,	autoDestroy			:true
,	remoteFilter		:true
,	pageSize			:Jx.pageSize
,	config				:
	{
		// store's current action (read, create, update, destroy).
		action		:"read"
	,	singleApi	:true
	,	extension	:_g_ext
	,	idProperty	:"id"
	,	proxy		:
		{
			type		:"ajax"
		,	filterParam	:undefined
		,	extraParams	:
			{
				action		:"read"
			,	query		:""
			,	subaction	:""
			}
		,	reader		:
			{
				type		:"json"
			,	root		:"data"
			}
		,	writer		:
			{
				type			:"json"
			,	allowSingle		:false
			,	writeRecordId	:false
			}
		}
	,	api			:
		{
			read		:"read"
		,	create		:"create"
		,	update		:"update"
		,	destroy		:"destroy"
		}
	}

,	rebuildUrl	:function (opts)
	{
		if (opts.url) {
			if (opts.singleApi) {
				this.proxy.api = {
						read	:opts.url
					,	create	:opts.url
					,	update	:opts.url
					,	destroy	:opts.url
					};
			} else {
				this.proxy.api = {
						read	:opts.url + opts.api.read		+ opts.extension
					,	create	:opts.url + opts.api.create		+ opts.extension
					,	update	:opts.url + opts.api.update 	+ opts.extension
					,	destroy	:opts.url + opts.api.destroy	+ opts.extension
					};
			}
		} else if (opts.api) {
			this.proxy.api = opts.api;
		}
	}

,	storeInit :function (opts)
	{
		this.rebuildUrl (opts);

		/* Check and merge for extra parameters */
		if (opts.extraParams && typeof (opts.extraParams) === "object") {
			Ext.merge (this.proxy.extraParams, opts.extraParams);
		}

		/* Set idProperty */
		this.model.prototype.idProperty = opts.idProperty;
	}

,	getIdProperty	:function ()
	{
		return this.model.prototype.idProperty;
	}
});

Ext.define ("Jx.Store", {
	extend		:"Ext.data.Store"
,	alias		:"jx.store"
,	mixins		:
	[
		'Jx.base.Store'
	]

,	constructor	:function (config)
	{
		var opts = Ext.merge ({}, this.config);

		Ext.merge (opts, config);

		this.callParent ([opts]);
		this.initConfig (opts);

		this.storeInit (opts);
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
		this.initConfig (opts);
	}
});

/*
	Custom store tree with REST + JSON.
*/
Ext.define ("Jx.StoreTree", {
	extend				:"Ext.data.TreeStore"
,	alias				:"jx.storetree"
,	defaultRootProperty	:"children"
,	root				:
	{
		text				:""
	,	expanded			:true
	,	children			:[]
	}
,	config	:
	{
		proxy	:
		{
			type		:"rest"
		,	appendId	:false
		}
	}
,	mixins	:
	[
		"Jx.base.Store"
	]

,	constructor	:function (config)
	{
		var opts = Ext.merge ({}, this.config);

		Ext.merge (opts, config);

		this.callParent ([opts]);
		this.initConfig (opts);

		this.storeInit (opts);
	}
});
