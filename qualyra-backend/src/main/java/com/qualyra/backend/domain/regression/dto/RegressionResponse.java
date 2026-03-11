package com.qualyra.backend.domain.regression.dto;

import com.qualyra.backend.domain.regression.Regression;
import com.qualyra.backend.domain.regression.RegressionResultValue;
import com.qualyra.backend.domain.regression.RegressionStatus;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record RegressionResponse(
        UUID id,
        String name,
        UUID templateId,
        String templateName,
        RegressionStatus status,
        int totalRules,
        long passed,
        long failed,
        long skipped,
        long pending,
        UUID createdById,
        String createdByName,
        Instant completedAt,
        Instant createdAt,
        List<RegressionItemResponse> items
) {
    public RegressionResponse(Regression r) {
        this(
                r.getId(),
                r.getName(),
                r.getTemplate().getId(),
                r.getTemplate().getName(),
                r.getStatus(),
                r.getItems().size(),
                r.getItems().stream().filter(i -> i.getResult() == RegressionResultValue.PASS).count(),
                r.getItems().stream().filter(i -> i.getResult() == RegressionResultValue.FAIL).count(),
                r.getItems().stream().filter(i -> i.getResult() == RegressionResultValue.SKIP).count(),
                r.getItems().stream().filter(i -> i.getResult() == null).count(),
                r.getCreatedBy().getId(),
                r.getCreatedBy().getName(),
                r.getCompletedAt(),
                r.getCreatedAt(),
                r.getItems().stream().map(RegressionItemResponse::new).toList()
        );
    }
}
