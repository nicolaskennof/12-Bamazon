-- Drops the bamazon if it exists currently --
DROP DATABASE IF EXISTS bamazon;

-- Creates the "bamazon" database --
CREATE DATABASE bamazon;

-- Makes it so all of the following code will affect bamazon --
USE bamazon;

-- Creates the table "products" within bamazon database --
CREATE TABLE products (
  item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT(4) NOT NULL,
  PRIMARY KEY (item_id)
  );

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pizza Pepperoni", "Deep Frozen Food", 8.99, 27);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tomato Sauce", "Canned Food", 1.99, 238);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Grated Mozzarrella Cheese", "Dairy", 18.99, 13);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Grated Munster Cheese", "Dairy", 16.99, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Jalapeño", "Vegetables", 0.49, 2248);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Red Onion", "Vegetables", 0.29, 1587);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Italian Sausage", "Deep Frozen Food", 10.99, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pineapple", "Fruits", 2.49, 14);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Crushed Peppers", "Spices", 2, 31);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Salt", "Spices", 0.95, 111);