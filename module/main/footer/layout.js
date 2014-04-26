/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxMainFooter (jx_main, id)
{
	this.id			= id;
	this.dir		= Jx.generateModDir (this.id);
	this._parent	= jx_main;

	this.panel			= Ext.create ("Ext.container.Container", {
			id			:this.id
		,	region		:"south"
		,	height		:20
		,	layout		:
			{
				type		:"hbox"
			,	align		:"middle"
			,	pack		:"center"
			}
		,	items		:
			[{
				xtype		:"box"
			,	flex		:1
			,	html		:"<a "
							+"	href='https://github.com/shuLhan/Jaring'"
							+"	target='_blank'"
							+">"
								+ _g_title
								+"&nbsp;&nbsp;&copy;&nbsp;&nbsp;"
								+ new Date().getFullYear()
								+" - Mhd Sulhan"
							+"</a>"
			}]
		});
}
