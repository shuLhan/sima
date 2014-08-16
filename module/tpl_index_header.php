<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "init.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title><?= Jaring::$_title ?></title>

	<link rel="icon" type="image/png" href="<?= Jaring::$_path ?>images/logo32.png"/>

	<script>
		var _g_root			="<?= Jaring::$_path ?>";
		var _g_module_dir	="<?= Jaring::$_path . Jaring::$_path_mod ?>/";
		var _g_module_path	="<?= $_SERVER['REQUEST_URI'] ?>";
		var _g_paging_size	= <?= Jaring::$_paging_size ?>;
		var _g_title		="<?= Jaring::$_title ?>";
		var _g_ext			="<?= Jaring::$_ext ?>";
		var _g_content_type	= <?= Jaring::$_content_type ?>;
		var _g_c_username	="<?= Jaring::$_c_username ?>";
		var _g_menu_mode	= <?= Jaring::$_menu_mode ?>;
		var _g_profile_id	= <?= Jaring::$_c_profile_id ?>;
	</script>

	<link rel="stylesheet" type="text/css" href="<?= Jaring::$_path ?>js/extjs/resources/ext-theme-neptune/ext-theme-neptune-all.css" />
	<link rel="stylesheet" type="text/css" href="<?= Jaring::$_path ?>css/jaring.css" />

	<script type="text/javascript" src="<?= Jaring::$_path ?>js/extjs/ext-all.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/extjs/ext-theme-neptune.js"></script>

<!--
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/extjs/ux/StatusBar.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/extjs/ux/BoxReorderer.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/extjs/ux/CheckCombo.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/extjs/ux/DataTip.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/extjs/ux/LiveSearchAddGridPanel.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/extjs/ux/LiveSearchGridPanel.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/extjs/ux/GridHeaderToolTip.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/extjs/ux/ProgressBarPager.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/extjs/ux/TreeCombo.js"></script>
-->
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/extjs/ux/all.js"></script>
<!--
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/jx/plugins/CopyButton.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/jx/plugins/CrudButtons.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/jx/plugins/ImportButton.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/jx/plugins/SearchField.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/jx/CardGridForm.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/jx/ComboGrid.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/jx/ComboPaging.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/jx/Form.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/jx/GridPaging.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/jx/GridTree.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/jx/GridPagingRowEditor.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/jx/GridPagingFormEditor.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/jx/Store.js"></script>
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/jaring.js"></script>
-->
	<script type="text/javascript" src="<?= Jaring::$_path ?>js/Jaring-all.js"></script>

	<link rel="stylesheet" type="text/css" href="<?= $_SERVER['REQUEST_URI'] ?>layout.css" />
	<script type="text/javascript" src="<?= $_SERVER['REQUEST_URI'] ?>layout.js"></script>
