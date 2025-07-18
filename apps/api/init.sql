-- This file will be executed automatically when the PostgreSQL container starts
-- Create database (if it does not exist)
SELECT 'CREATE DATABASE pynext_turbo'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pynext_turbo')\gexec