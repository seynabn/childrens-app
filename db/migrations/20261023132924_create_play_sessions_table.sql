-- migrate:up


-- migrate:down


-- migrate:up
CREATE TABLE play_sessions (
    session_id BIGSERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL
        REFERENCES children(child_id)
        ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    engagement TEXT
        CHECK (
            engagement IN (
                'engaged',
                'mixed',
                'lost_interest'
            )
        ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_session_times
        CHECK (
            ended_at IS NULL
            OR ended_at >= started_at
        )
);

-- migrate:down
DROP TABLE play_sessions;
