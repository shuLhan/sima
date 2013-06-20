/*
	Copyright 2013 - x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)

	Custom store with AJAX and JSON.
*/
Ext.define ("Jx.Store", {
	extend		:"Ext.data.Store"
,	alias		:"jx.store"
,	autoLoad	:false
,	autoSync	:false
,	autoDestroy	:true
,	config		:
	{
		action		:"read"	// store's current action (read, create, update, destroy).
	,	singleApi	:true
	,	extension	:".jsp"
	,	proxy		:
		{
			type		:"ajax"
		,	filterParam	:undefined
		,	extraParams	:
			{
				action		:"read"
			,	query		:""
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
	,	api			:
		{
			read		:"/read"
		,	create		:"/create"
		,	update		:"/update"
		,	destroy		:"/destroy"
		}
	}

,	constructor	:function (config)
	{
		var opts = Ext.merge (this.config, config);

		this.callParent (arguments);
		this.initConfig (opts);

		console.log (opts);

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

		/* Check and merge for extra parameters */
		if (opts.extraParams && typeof (opts.extraParams) === "object") {
			this.proxy.extraParams = Ext.merge (this.proxy.extraParams, opts.extraParams);
		}
	}
});
