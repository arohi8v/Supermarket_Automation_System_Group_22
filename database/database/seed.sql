INSERT INTO users (username, password, role) VALUES ('employee1', 'password123', 'EMPLOYEE');
INSERT INTO users (username, password, role) VALUES ('manager1', 'passsword123', 'MANAGER');

INSERT INTO products (id, name, description, stock, expiry_date, price) VALUES (1, 'Milk', '1L of fresh milk', 100, '2024-12-31', 1.50);
INSERT INTO products (id, name, description, stock, expiry_date, price) VALUES (2, 'Bread', 'Whole grain bread', 50, '2024-11-30', 2.00);
INSERT INTO products (id, name, description, stock, expiry_date, price) VALUES (3, 'Eggs', 'Dozen of large eggs', 200, '2024-10-15', 3.00);
INSERT INTO products (id, name, description, stock, expiry_date, price) VALUES (4, 'Apples', 'Fresh red apples', 150, '2024-09-01', 0.50);
INSERT INTO products (id, name, description, stock, expiry_date, price) VALUES (5, 'Chicken', '1kg of chicken breast', 75, '2024-08-15', 5.00);

INSERT INTO customers (id, name, loyalty_points) VALUES (1, 'John Doe', 100);
INSERT INTO customers (id, name, loyalty_points) VALUES (2, 'Jane Smith', 200);
INSERT INTO customers (id, name, loyalty_points) VALUES (3, 'Alice Johnson', 150);

INSERT INTO promotions (id, name, discount, associated_product_id) VALUES (1, 'Summer Sale', 10, 1);
INSERT INTO promotions (id, name, discount, associated_product_id) VALUES (2, 'Buy One Get One Free', 100, 2);