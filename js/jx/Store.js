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
	}

,	constructor	:function (config)
	{
		this.callParent (arguments);
		this.initConfig (config);

		if (config.url) {
			this.getProxy ().api = {
					read	:config.url
				,	create	:config.url
				,	update	:config.url
				,	destroy	:config.url
				}
		} else if (config.api) {
			this.getProxy ().api = config.api;
		}

		/* Check and merge for extra parameters */
		if (config.extraParams && typeof (config.extraParams) === "object") {
			this.proxy.extraParams = Ext.merge (this.proxy.extraParams, config.extraParams);
		}
	}
});
