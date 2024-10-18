DROP SCHEMA IF EXISTS ccca CASCADE;

CREATE SCHEMA ccca;

CREATE TYPE difficulty AS ENUM ('EASY', 'MEDIUM', 'HARD');

CREATE TABLE ccca.question (
    question_id UUID PRIMARY KEY,
    question TEXT NOT NULL,
    response TEXT NOT NULL,
    difficulty difficulty NOT NULL,
    article TEXT NOT NULL,
    error_rate INT NOT NULL DEFAULT 0,
    success_rate INT NOT NULL DEFAULT 0
);
