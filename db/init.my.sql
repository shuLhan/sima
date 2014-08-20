/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
create database sima;

create user 'sima'@'localhost' identified by 'sima';

grant all on sima.* to 'sima'@'localhost';
