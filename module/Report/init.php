<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
	- mhd.sulhan (m.shulhan@gmail.com)
*/
Jaring::db_init ();

function get_asset ($id)
{
	$qselect	="
		select	A.*
		,		AT.name				as asset_type_name
		,		AA.cost				as assign_cost
		,		AA.assign_date
		,		AA._user_id			as assign_user_id
		,		U.realname			as assign_user_name
		,		AA.location_id		as assign_location_id
		,		AL.name				as assign_location_name
		,		AA.location_detail	as assign_location_detail
		,		AA.description		as assign_description
		,		AP.name				as procurement_name
	";

	$qfrom	="
		from asset A
		left join asset_assign_log	AA
			on AA.id = (
				select	id
				from	asset_assign_log
				where	asset_id = A.id
				order by assign_date desc
				limit	0,1
			)
		left join asset_type		AT	on A.type_id			= AT.id
		left join asset_procurement AP	on A.procurement_id 	= AP.id
		left join asset_location	AL	on AA.location_id		= AL.id
		left join _user				U	on AA._user_id			= U.id
	";

	$qwhere ="
		where A.status = 1
	";

	if (0 !== $id) {
		$qwhere .=" and A.id = ". $id;
	}

	$qorder = " order by A.id desc ";

	/* Get data */
	$qread	= $qselect
			. $qfrom
			. $qwhere
			. $qorder;

	return Jaring::db_execute ($qread)[0];
}

function get_asset_assign_log ($id)
{
	$q	="
		select	AA.cost
		,		AA.assign_date
		,		AA.location_detail
		,		AA.description
		,		AL.name				as location_name
		,		U.realname			as user_name
		from	asset_assign_log	AA
			left join _user				U	on AA._user_id		= U.id
			left join asset_location	AL	on AA.location_id	= AL.id
		where	asset_id = $id
		order	by assign_date		DESC
	";

	return Jaring::db_execute ($q);
}

function get_asset_maintenance_log ($id)
{
	$q	="
		select	AML.*
		from	asset_maintenance_log	AML
		where	asset_id = $id
		order	by maintenance_date		DESC
	";

	return Jaring::db_execute ($q);
}

function get_company_profile ()
{
	$q	="
		select	*
		from	_profile
	";

	return Jaring::db_execute ($q)[0];
}

function get_company_profile_logo ()
{
	return "/module/System/Profile/Logo/read.php?_profile_id=". Jaring::$_c_profile_id ."&_dc=". time ();
}

function render_profile ()
{
	$profile = get_company_profile ();

	require_once ("tpl_profile.php");
}

function render_asset ($asset_id, $render_assignment = false)
{
	$asset = get_asset ($asset_id);

	require_once ("tpl_asset.php");
}
