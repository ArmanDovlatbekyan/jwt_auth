
-- The first we need to create our DB 

CREATE DATABASE IF NOT EXISTS jwt;

-- then.. 

CREATE TABLE users (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(255),
  password VARCHAR(255),
  created_at DATETIME,
  updated_at DATETIME
);

