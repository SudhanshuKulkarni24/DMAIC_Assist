-- Initialize database with extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data integrity
CREATE TYPE dmaic_stage AS ENUM ('define', 'measure', 'analyze', 'improve', 'control');
CREATE TYPE project_status AS ENUM ('active', 'completed', 'on_hold', 'cancelled');
CREATE TYPE analysis_status AS ENUM ('pending', 'running', 'completed', 'failed');

-- Set timezone
SET timezone = 'UTC';