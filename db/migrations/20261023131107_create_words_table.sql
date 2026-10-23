
-- migrate:up
CREATE TABLE words (
    word_id BIGSERIAL PRIMARY KEY,
    word TEXT NOT NULL UNIQUE,
    image TEXT,
    level SMALLINT NOT NULL DEFAULT 1
        CHECK (level >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:down
DROP TABLE words;
