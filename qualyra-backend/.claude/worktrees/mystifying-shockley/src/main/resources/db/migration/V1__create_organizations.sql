CREATE TABLE organizations (
                               id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               name        VARCHAR(160) NOT NULL,
                               type        VARCHAR(20)  NOT NULL,
                               plan        VARCHAR(20)  NOT NULL DEFAULT 'FREE',
                               created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
