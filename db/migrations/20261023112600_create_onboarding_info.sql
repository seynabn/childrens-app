
-- migrate:up

CREATE TABLE onboarding_info (
    onboarding_id BIGSERIAL PRIMARY KEY,

    child_id BIGINT NOT NULL UNIQUE
        REFERENCES children(child_id)
        ON DELETE CASCADE,

    can_your_child_speak TEXT NOT NULL
        CHECK (
            can_your_child_speak IN (
                'not_yet',
                'some',
                'many'
            )
        ),

    combines_words TEXT
        CHECK (
            combines_words IN (
                'not_yet',
                'sometimes',
                'often'
            )
        ),

    swedish_exposure TEXT
        CHECK (
            swedish_exposure IN (
                'mostly_swedish',
                'several_languages',
                'some_swedish',
                'little_swedish'
            )
        ),

    other_languages TEXT[] NOT NULL DEFAULT '{}',

    communication_modes TEXT[] NOT NULL DEFAULT '{}',

    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        can_your_child_speak <> 'not_yet'
        OR combines_words IS NULL
    )
);

-- migrate:down

DROP TABLE onboarding_info;
