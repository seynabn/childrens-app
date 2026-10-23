
-- migrate:up

CREATE TABLE child_interests (
    interest_id BIGSERIAL PRIMARY KEY,

    child_id BIGINT NOT NULL
        REFERENCES children(child_id)
        ON DELETE CASCADE,

    interest TEXT NOT NULL
        CHECK (
            interest IN (
                'animals',
                'vehicles',
                'music',
                'books_stories',
                'food',
                'water_bathing',
                'nature',
                'other'
            )
        ),

    other_description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (child_id, interest),

    CHECK (
        interest = 'other'
        OR other_description IS NULL
    )
);

-- migrate:down

DROP TABLE child_interests;
