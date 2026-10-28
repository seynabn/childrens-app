-- migrate:up

CREATE TABLE story_words (
    story_id BIGINT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    word_id BIGINT NOT NULL REFERENCES words(word_id) ON DELETE CASCADE,
    PRIMARY KEY (story_id, word_id)
);

-- migrate:down

DROP TABLE story_words;

