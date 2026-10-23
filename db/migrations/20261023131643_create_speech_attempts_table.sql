
-- migrate:up
CREATE TABLE speech_attempts (
    attempt_id BIGSERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL
        REFERENCES children(child_id)
        ON DELETE CASCADE,
    word_id BIGINT NOT NULL
        REFERENCES words(word_id)
        ON DELETE CASCADE,
    attempted_text TEXT,
    recognition_status TEXT NOT NULL DEFAULT 'unprocessed'
        CHECK (
            recognition_status IN (
                'unprocessed',
                'matched',
                'uncertain',
                'not_matched'
            )
        ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:down
DROP TABLE speech_attempts;
