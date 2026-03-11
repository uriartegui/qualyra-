package com.qualyra.backend.domain.regression.dto;

import com.qualyra.backend.domain.regression.Regression;
import com.qualyra.backend.domain.regression.RegressionResultValue;
import com.qualyra.backend.domain.regression.RegressionStatus;

import java.time.Instant;
import java.util.UUID;

public record RegressionSummaryResponse(
        UUID id,
        String name,
        String templateName,
        RegressionStatus status,
        int totalRules,
        long passed,
        long failed,
        long pending,
        Instant createdAt
) {
    public RegressionSummaryResponse(Regression r) {
        this(
                r.getId(),
                r.getName(),
                r.getTemplate().getName(),
                r.getStatus(),
                r.getItems().size(),
                r.getItems().stream().filter(i -> i.getResult() == RegressionResultValue.PASS).count(),
                r.getItems().stream().filter(i -> i.getResult() == RegressionResultValue.FAIL).count(),
                r.getItems().stream().filter(i -> i.getResult() == null).count(),
                r.getCreatedAt()
        );
    }
}
