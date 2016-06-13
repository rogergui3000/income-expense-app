create table users (
  id serial primary key,
  created_at timestamp default current_timestamp,
  name character varying(64),
  email character varying(84),
  password character varying(84),
  token character varying(255)
  
);

create table account
(
    id serial primary key,
    type varchar(100) not null,
    amount decimal(12,0) not null,
    date_add timestamp default current_timestamp,
    day_due varchar(22) not null,
    userId int not null
);

create table cathegory
(
    id serial primary key,
    catName varchar(100) not null,
    uncategorized varchar(100),
    amount int,
    type int
);


create table income
(
    id serial primary key,
    name varchar(100) ,
    amount decimal(12,0) ,
    date_add timestamp default current_timestamp,
    day_due varchar(22) ,
    payment int default 0,
    userId int ,
    catId int 
);

create table expense
(
    id serial primary key,
    name varchar(100) ,
    amount decimal(12,0),
    date_add timestamp default current_timestamp,
    day_due varchar(22) ,
    payment int default 0,
    userId int ,
    catId int 
);

create table transaction
(
    id serial primary key,
    name varchar(100),
    amount decimal(12,0) ,
    date_add timestamp default current_timestamp,
    day_due varchar(22) ,
    payment int default 0,
    userId int ,
    catId int 
);


create table budget
(
    id serial primary key,
    amount decimal(12,0) ,
    date_add timestamp default current_timestamp,
    userId int,
    catId int 
);






