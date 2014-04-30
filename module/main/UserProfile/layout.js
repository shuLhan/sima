/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxMainUserProfile ()
{
	this.id		= "main_UserProfile";
	this.dir	= Jx.generateModDir (this.id);

	this.store			= Ext.create ("Jx.Store", {
			url			:Jx.generateModDir ("System_User")
		,	singleApi	:false
		,	fields		:
			[
				"id"
			,	"name"
			,	"realname"
			,	"group_name"
			,	"password_old"
			,	"password"
			]
		});

	this.panel			= Ext.create ("Jx.Form", {
			id			:this.id +"Form"
		,	store		:this.store
		,	defaults	:
			{
				labelAlign	:"right"
			,	labelWidth	:160
			}
		,	items		:
			[{
				name		:"id"
			,	hidden		:true
			},{
				fieldLabel	:"User name"
			,	name		:"realname"
			,	allowBlank	:false
			},{
				fieldLabel	:"User ID"
			,	name		:"name"
			,	xtype		:"displayfield"
			},{
				fieldLabel	:"Group"
			,	name		:"group_name"
			,	xtype		:"displayfield"
			},{
				fieldLabel	:"New password"
			,	name		:"password_new1"
			,	vtype		:"alphanum"
			},{
				fieldLabel	:"Confirm new password"
			,	name		:"password_new2"
			,	vtype		:"alphanum"
			},{
				name		:"password_old"
			,	hidden		:true
			},{
				name		:"password"
			,	hidden		:true
			}]

		,	beforeFormSave	: function ()
			{
				var r	= this.getValues (false, true, false);
				var p1	= r.password_new1;
				var p2	= r.password_new2;

				if (p1 !== p2) {
					Jx.msg.error ("Your new password is not match! Try again.");
					return false;
				} else {
					this.getForm ().setValues ({
						password:p1
					});
				}

				this.store.action = "update";
			}

		,	afterFormSave	: function (success)
			{
				if (success) {
					this.ownerCt.close ();
				}
			}

		,	afterFormCancel : function ()
			{
				this.ownerCt.close ();
			}
		});

	this.win			= Ext.create ("Ext.window.Window", {
			id			:this.id
		,	title		:"User Profile"
		,	modal		:true
		,	draggable	:false
		,	autoResize	:false
		,	layout		:"fit"
		,	items		:
			[
				this.panel
			]
		});

	this.doShow	= function ()
	{
		this.store.load ({
			scope		:this
		,	params		:
			{
				query		:_g_c_username
			}
		,	callback	:function (r, op, success)
			{
				if (! success) {
					Jx.msg.error ("Failed to load user's profile!");
					return false;
				}
				if (r.length <= 0) {
					Jx.msg.error ("Can't load user's profile!");
					return false;
				}
				this.panel.loadRecord (r[0]);
				this.win.show ();
				return true;
			}
		});
		return true;
	};
}

//# sourceURL=module/main/UserProfile/layout.js
