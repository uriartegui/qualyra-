package com.qualyra.backend.domain.rule.dto;

import com.qualyra.backend.domain.rule.Rule;

import java.time.Instant;
import java.util.UUID;

public record RuleResponse(
        UUID id,
        UUID topicId,
        String topicName,
        String title,
        String description,
        String expectedResult,
        boolean active,
        UUID createdById,
        String createdByName,
        Instant createdAt
) {
    public RuleResponse(Rule r) {
        this(r.getId(),
                r.getTopic().getId(), r.getTopic().getName(),
                r.getTitle(), r.getDescription(), r.getExpectedResult(),
                r.isActive(),
                r.getCreatedBy().getId(), r.getCreatedBy().getName(),
                r.getCreatedAt());
    }
}
