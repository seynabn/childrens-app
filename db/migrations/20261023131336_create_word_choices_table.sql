
-- migrate:up
CREATE TABLE word_choices (
    choice_id BIGSERIAL PRIMARY KEY,
    word_id BIGINT NOT NULL
        REFERENCES words(word_id)
        ON DELETE CASCADE,
    alternative_word_id BIGINT NOT NULL
        REFERENCES words(word_id)
        ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_word_choice
        UNIQUE (word_id, alternative_word_id),

    CONSTRAINT different_words
        CHECK (word_id <> alternative_word_id)
);

-- migrate:down
DROP TABLE word_choices;
