/*
	Global javascript for application.
 */
Jx = {
	msg	: {
		el		:''
	,	display :function (title, format, cls, delay)
		{
			if (! this.el) {
				this.el = Ext.DomHelper.insertFirst (document.body, {id:'jx-msg'}, true);
			}
			var s = Ext.String.format.apply (String, Array.prototype.slice.call(arguments, 1));
			var m = Ext.DomHelper.append (this.el
					, '<div class="'+ cls +'"><h3>' + title + '</h3><p>' + s + '</p></div>'
					, true);
			m.hide();
			m.slideIn ('t').ghost ("t", { delay: delay, remove: true });
		}

	,	info	:function (format)
		{
			this.display ('Informasi', format, 'info', 2000);
		}

	,	error	:function (format)
		{
			this.display ('Kesalahan', format, 'error', 4000);
		}
	}
};
