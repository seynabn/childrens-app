
-- migrate:up
ALTER TABLE speech_attempts
ADD COLUMN session_id BIGINT
    REFERENCES play_sessions(session_id)
    ON DELETE CASCADE;

-- migrate:down
ALTER TABLE speech_attempts
DROP COLUMN session_id;
