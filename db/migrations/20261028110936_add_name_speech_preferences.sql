-- migrate:up

ALTER TABLE onboarding_info
ADD COLUMN use_name_in_speech BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE onboarding_info
ADD COLUMN name_pronunciation_confirmed BOOLEAN NOT NULL DEFAULT FALSE;


-- migrate:down

ALTER TABLE onboarding_info
DROP COLUMN name_pronunciation_confirmed;

ALTER TABLE onboarding_info
DROP COLUMN use_name_in_speech;