CREATE DATABASE IF NOT EXISTS voicecart_db;
USE voicecart_db;

-- 1. Users (customers & agents)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    role ENUM('CUSTOMER', 'AGENT') DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products (menu)
CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image_url VARCHAR(255)
);

-- 3. Calls log
CREATE TABLE IF NOT EXISTS calls (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    call_sid VARCHAR(100) UNIQUE,
    customer_phone VARCHAR(15) NOT NULL,
    agent_id BIGINT,
    status ENUM('RINGING', 'IN_PROGRESS', 'COMPLETED', 'MISSED') DEFAULT 'RINGING',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    FOREIGN KEY (agent_id) REFERENCES users(id)
);

-- 4. Orders
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(30) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL,
    agent_id BIGINT,
    call_id BIGINT,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED') DEFAULT 'PENDING',
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (agent_id) REFERENCES users(id),
    FOREIGN KEY (call_id) REFERENCES calls(id)
);

-- 5. Order items
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample menu items
INSERT IGNORE INTO products (name, description, price, category) VALUES
('Margherita Pizza', 'Classic cheese and tomato', 9.99, 'Pizza'),
('Pepperoni Pizza', 'Spicy pepperoni', 12.99, 'Pizza'),
('Veggie Burger', 'Grilled veg patty', 7.99, 'Burger'),
('French Fries', 'Crispy salted fries', 3.49, 'Sides'),
('Coca Cola', '330ml can', 1.99, 'Beverages'),
('Chocolate Milkshake', 'Thick chocolate shake', 4.99, 'Beverages');

-- Insert a default agent (for testing)
INSERT IGNORE INTO users (phone_number, name, email, role) VALUES
('+1234567890', 'Support Agent', 'agent@voicecart.com', 'AGENT');

-- Insert a default test customer
INSERT IGNORE INTO users (phone_number, name, email, address, role) VALUES
('+919876543210', 'John Doe', 'john@example.com', '123 Main St', 'CUSTOMER');
