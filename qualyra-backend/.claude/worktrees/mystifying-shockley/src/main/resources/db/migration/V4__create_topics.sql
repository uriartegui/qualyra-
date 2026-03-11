CREATE TABLE topics (
                        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        organization_id UUID         NOT NULL REFERENCES organizations(id),
                        name            VARCHAR(160) NOT NULL,
                        description     TEXT,
                        created_by_id   UUID         NOT NULL REFERENCES users(id),
                        active          BOOLEAN      NOT NULL DEFAULT TRUE,
                        created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                        updated_at      TIMESTAMPTZ
);

CREATE INDEX idx_topics_organization_id ON topics(organization_id);
