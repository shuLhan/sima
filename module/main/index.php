<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../tpl_index_header.php";
?>
	<link rel="stylesheet" type="text/css" href="<?= $_SERVER['REQUEST_URI'] ?>app.css" />
</head>
<body>
    <div id="loading-mask" style=""></div>
    <div id="loading">
        <div class="loading-indicator">
            <img src="<?= Jaring::$_path ?>images/loading.gif"
				width="32"
				height="32"
				style="margin-right:8px;float:left;vertical-align:top;"
			/>
			<a href="http://github.com/shuLhan/Jaring">
			<?= Jaring::$_title ?>
			</a>
            <br />
			<span id="loading-msg">Loading application...</span>
        </div>
    </div>

	<script type="text/javascript" src="<?= $_SERVER['REQUEST_URI'] ?>header/layout.js"></script>
	<script type="text/javascript" src="<?= $_SERVER['REQUEST_URI'] ?>home/layout.js"></script>
	<script type="text/javascript" src="<?= $_SERVER['REQUEST_URI'] ?>dashboard/layout.js"></script>
	<script type="text/javascript" src="<?= $_SERVER['REQUEST_URI'] ?>UserProfile/layout.js"></script>
	<script type="text/javascript" src="<?= $_SERVER['REQUEST_URI'] ?>footer/layout.js"></script>
<!-- app -->
	<script type="text/javascript" src="<?= $_SERVER['REQUEST_URI'] ?>app.js"></script>
</body>
</html>
