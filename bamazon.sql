DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE items(
    item_id INT NOT NULL,
    product VARCHAR (45) NULL,
    department VARCHAR (45) NULL,
    price DECIMAL (9,2),
    stockQuantity INTEGER (10)
);

SELECT * FROM items;