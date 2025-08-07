INSERT INTO Customers (name, email, phone, address) VALUES
('Ankit Kumar', 'ankit@example.com', '9999999999', 'Delhi, India'),
('Riya Mehta', 'riya@example.com', '8888888888', 'Mumbai, India');

INSERT INTO Products (name, description, price, stock) VALUES
('Laptop', '15-inch laptop with 8GB RAM', 55000.00, 10),
('Headphones', 'Wireless over-ear headphones', 3000.00, 50);

INSERT INTO Orders (customer_id, order_date, total_amount) VALUES
(1, '2025-07-30', 58000.00);

INSERT INTO OrderDetails (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 55000.00),
(1, 2, 1, 3000.00);