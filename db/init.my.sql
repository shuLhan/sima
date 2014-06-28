create database sima;

create user 'sima'@'localhost' identified by 'sima';

grant all on sima.* to 'sima'@'localhost';
