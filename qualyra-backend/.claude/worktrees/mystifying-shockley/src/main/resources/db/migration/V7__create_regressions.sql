CREATE TABLE regressions (
                             id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                             organization_id UUID        NOT NULL REFERENCES organizations(id),
                             template_id     UUID        NOT NULL REFERENCES templates(id),
                             name            VARCHAR(200) NOT NULL,
                             status          VARCHAR(20)  NOT NULL DEFAULT 'IN_PROGRESS',
                             created_by_id   UUID         NOT NULL REFERENCES users(id),
                             completed_at    TIMESTAMPTZ,
                             created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE regression_results (
                                    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                    regression_id   UUID        NOT NULL REFERENCES regressions(id),
                                    rule_id         UUID        NOT NULL REFERENCES rules(id),
                                    result          VARCHAR(20),
                                    notes           TEXT,
                                    executed_by_id  UUID        REFERENCES users(id),
                                    executed_at     TIMESTAMPTZ,
                                    UNIQUE (regression_id, rule_id)
);

CREATE INDEX idx_regressions_organization_id ON regressions(organization_id);
CREATE INDEX idx_regression_results_regression_id ON regression_results(regression_id);
