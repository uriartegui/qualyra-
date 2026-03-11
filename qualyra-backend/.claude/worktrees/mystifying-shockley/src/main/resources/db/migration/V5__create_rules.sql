CREATE TABLE rules (
                       id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       organization_id UUID         NOT NULL REFERENCES organizations(id),
                       topic_id        UUID         NOT NULL REFERENCES topics(id),
                       title           VARCHAR(200) NOT NULL,
                       description     TEXT,
                       expected_result TEXT,
                       active          BOOLEAN      NOT NULL DEFAULT TRUE,
                       created_by_id   UUID         NOT NULL REFERENCES users(id),
                       created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                       updated_at      TIMESTAMPTZ
);

CREATE INDEX idx_rules_organization_id ON rules(organization_id);
CREATE INDEX idx_rules_topic_id        ON rules(topic_id);
