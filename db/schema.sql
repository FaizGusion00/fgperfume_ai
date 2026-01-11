-- MySQL schema for FGPerfume
CREATE TABLE IF NOT EXISTS brand_info (
  id INT PRIMARY KEY DEFAULT 1,
  story TEXT,
  companyInfo TEXT
);

CREATE TABLE IF NOT EXISTS contact_info (
  id INT PRIMARY KEY DEFAULT 1,
  email VARCHAR(255),
  phone VARCHAR(64),
  address TEXT,
  social_facebook VARCHAR(255),
  social_instagram VARCHAR(255),
  social_twitter VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS perfumes (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  inspiration TEXT,
  topNotes JSON,
  middleNotes JSON,
  baseNotes JSON,
  price DECIMAL(10,2),
  availability VARCHAR(64),
  isVisible BOOLEAN DEFAULT TRUE,
  `character` TEXT,
  `usage` TEXT,
  longevity VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user_queries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  query TEXT NOT NULL,
  timestamp BIGINT NOT NULL
);
