CREATE DATABASE IF NOT EXISTS musiclovers;
USE musiclovers;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  birthdate DATE,
  gender ENUM('Male','Female','Other'),
  role ENUM('Client','Administrator') DEFAULT 'Client'
);

CREATE TABLE IF NOT EXISTS devices (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  device_id VARCHAR(100) NOT NULL,
  user_id BIGINT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tests (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  test_type VARCHAR(100) NOT NULL,
  user_id BIGINT NOT NULL,
  subuser VARCHAR(100),
  gap INT NOT NULL,
  wrong_answers JSON,
  FOREIGN KEY (user_id) REFERENCES users(id)
);