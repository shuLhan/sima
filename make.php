#!/usr/bin/php
<?php

function genjs ($out, $in)
{
	$fout = fopen ($out, "wb");

	foreach ($in as $js) {
		$fin = file_get_contents ($js);

		$s = fwrite ($fout, $fin);

		if (false === $s) {
			echo "Error writing content of ". $js ." to ". $out;
			die;
		}
	}

	fclose ($fout);
}

$out="js/extjs/ux/all.js";

$in=array (
	"js/extjs/ux/StatusBar.js"
,	"js/extjs/ux/BoxReorderer.js"
,	"js/extjs/ux/CheckCombo.js"
,	"js/extjs/ux/DataTip.js"
,	"js/extjs/ux/LiveSearchAddGridPanel.js"
,	"js/extjs/ux/LiveSearchGridPanel.js"
,	"js/extjs/ux/GridHeaderToolTip.js"
,	"js/extjs/ux/ProgressBarPager.js"
,	"js/extjs/ux/TreeCombo.js"
);

genjs ($out, $in);

$out="js/Jaring-all.js";

$in=array (
	"js/jaring.js"
,	"js/jx/plugins/CrudButtons.js"
,	"js/jx/plugins/SearchField.js"
,	"js/jx/Store.js"
,	"js/jx/ComboPaging.js"
,	"js/jx/Form.js"
,	"js/jx/SearchField.js"
,	"js/jx/GridPaging.js"
,	"js/jx/GridPagingRowEditor.js"
,	"js/jx/GridPagingFormEditor.js"
);

genjs ($out, $in);
