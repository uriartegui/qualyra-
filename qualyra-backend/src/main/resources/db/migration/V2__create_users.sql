CREATE TABLE users (
                       id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       organization_id UUID        NOT NULL REFERENCES organizations(id),
                       name            VARCHAR(160) NOT NULL,
                       email           VARCHAR(160) NOT NULL UNIQUE,
                       password        VARCHAR(255) NOT NULL,
                       role            VARCHAR(20)  NOT NULL,
                       active          BOOLEAN      NOT NULL DEFAULT TRUE,
                       created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                       updated_at      TIMESTAMPTZ
);

CREATE INDEX idx_users_email           ON users(email);
CREATE INDEX idx_users_organization_id ON users(organization_id);
