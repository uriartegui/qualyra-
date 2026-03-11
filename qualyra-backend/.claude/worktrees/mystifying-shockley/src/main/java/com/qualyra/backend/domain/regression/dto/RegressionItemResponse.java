package com.qualyra.backend.domain.regression.dto;

import com.qualyra.backend.domain.regression.RegressionItem;
import com.qualyra.backend.domain.regression.RegressionResultValue;

import java.time.Instant;
import java.util.UUID;

public record RegressionItemResponse(
        UUID id,
        UUID ruleId,
        String ruleTitle,
        String ruleExpectedResult,
        String topicName,
        RegressionResultValue result,
        String notes,
        UUID executedById,
        String executedByName,
        Instant executedAt
) {
    public RegressionItemResponse(RegressionItem item) {
        this(
                item.getId(),
                item.getRule().getId(),
                item.getRule().getTitle(),
                item.getRule().getExpectedResult(),
                item.getRule().getTopic().getName(),
                item.getResult(),
                item.getNotes(),
                item.getExecutedBy() != null ? item.getExecutedBy().getId() : null,
                item.getExecutedBy() != null ? item.getExecutedBy().getName() : null,
                item.getExecutedAt()
        );
    }
}
