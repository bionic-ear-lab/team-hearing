CREATE DATABASE IF NOT EXISTS musiclovers;
USE musiclovers;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  birthdate DATE,
  gender ENUM('Male','Female','Other'),
  role ENUM('Client','Administrator') DEFAULT 'Client',
  volume DOUBLE DEFAULT 1.0
);

CREATE TABLE IF NOT EXISTS devices (
  device_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  ear ENUM('Left', 'Right') NOT NULL,
  device_type ENUM('Cochlear Implant', 'Hearing Aid', 'Other') NOT NULL,
  manufacturer ENUM('Advanced Bionics', 'Cochlear', 'Med-El', 'Other') NOT NULL,
  activation_date DATE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tests (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  test_type VARCHAR(100) NOT NULL,
  user_id BIGINT NOT NULL,
  subuser VARCHAR(100),
  gap INT,
  wrong_answers JSON,
  note_range VARCHAR(100),
  time_logged TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY (user_id) REFERENCES users(id)
);