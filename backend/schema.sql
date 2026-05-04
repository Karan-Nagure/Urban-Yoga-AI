-- ============================================================
-- Urban Yogi Database Schema
-- Run this file in MySQL to set up the database
-- Usage: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS urban_yogi;
USE urban_yogi;

-- ────────────────────────────────────────────────────────────
-- Users table
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  username     VARCHAR(50)  NOT NULL UNIQUE,
  email        VARCHAR(100) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  full_name    VARCHAR(100) DEFAULT '',
  age          INT          DEFAULT NULL,
  gender       ENUM('Male','Female','Other','Prefer not to say') DEFAULT 'Prefer not to say',
  height_cm    FLOAT        DEFAULT NULL,
  weight_kg    FLOAT        DEFAULT NULL,
  fitness_goal VARCHAR(200) DEFAULT '',
  bio          TEXT         DEFAULT '',
  avatar_color VARCHAR(20)  DEFAULT '#7a9e7e',
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ────────────────────────────────────────────────────────────
-- Pose sessions table — tracks every yoga session per user
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pose_sessions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT          NOT NULL,
  pose_name    VARCHAR(100) NOT NULL,
  duration_sec FLOAT        NOT NULL DEFAULT 0,
  best_sec     FLOAT        NOT NULL DEFAULT 0,
  practiced_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
-- Indexes for fast lookups
-- ────────────────────────────────────────────────────────────
CREATE INDEX idx_sessions_user    ON pose_sessions(user_id);
CREATE INDEX idx_sessions_pose    ON pose_sessions(pose_name);
CREATE INDEX idx_sessions_date    ON pose_sessions(practiced_at);
