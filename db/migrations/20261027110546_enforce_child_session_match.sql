-- migrate:up

CREATE UNIQUE INDEX play_sessions_session_child_unique
ON play_sessions (session_id, child_id);

ALTER TABLE speech_attempts
ADD CONSTRAINT speech_attempts_session_child_fkey
FOREIGN KEY (session_id, child_id)
REFERENCES play_sessions (session_id, child_id)
ON DELETE CASCADE;

-- migrate:down

ALTER TABLE speech_attempts
DROP CONSTRAINT speech_attempts_session_child_fkey;

DROP INDEX play_sessions_session_child_unique;