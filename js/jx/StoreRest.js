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
	,	singleApi	:true
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
		this.initConfig (opts);

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
