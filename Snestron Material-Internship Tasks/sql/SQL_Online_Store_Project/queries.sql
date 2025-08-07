SELECT * FROM Customers;

SELECT name, stock FROM Products WHERE stock > 0;

SELECT o.order_id, c.name, o.order_date, o.total_amount
FROM Orders o
JOIN Customers c ON o.customer_id = c.customer_id;

SELECT c.name, p.name AS product, od.quantity, od.price
FROM OrderDetails od
JOIN Orders o ON od.order_id = o.order_id
JOIN Customers c ON o.customer_id = c.customer_id
JOIN Products p ON od.product_id = p.product_id;