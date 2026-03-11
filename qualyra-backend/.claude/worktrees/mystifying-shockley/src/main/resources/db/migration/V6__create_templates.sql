CREATE TABLE templates (
                           id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           organization_id UUID         NOT NULL REFERENCES organizations(id),
                           name            VARCHAR(200) NOT NULL,
                           description     TEXT,
                           active          BOOLEAN      NOT NULL DEFAULT TRUE,
                           created_by_id   UUID         NOT NULL REFERENCES users(id),
                           created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                           updated_at      TIMESTAMPTZ
);

CREATE TABLE template_rules (
                                template_id UUID NOT NULL REFERENCES templates(id),
                                rule_id     UUID NOT NULL REFERENCES rules(id),
                                PRIMARY KEY (template_id, rule_id)
);

CREATE INDEX idx_templates_organization_id ON templates(organization_id);
