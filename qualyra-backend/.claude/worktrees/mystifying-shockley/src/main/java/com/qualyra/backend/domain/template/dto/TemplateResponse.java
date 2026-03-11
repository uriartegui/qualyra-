package com.qualyra.backend.domain.template.dto;

import com.qualyra.backend.domain.rule.dto.RuleResponse;
import com.qualyra.backend.domain.template.Template;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record TemplateResponse(
        UUID id,
        String name,
        String description,
        boolean active,
        UUID createdById,
        String createdByName,
        int totalRules,
        Set<RuleResponse> rules,
        Instant createdAt
) {
    public TemplateResponse(Template t) {
        this(
                t.getId(),
                t.getName(),
                t.getDescription(),
                t.isActive(),
                t.getCreatedBy().getId(),
                t.getCreatedBy().getName(),
                t.getRules().size(),
                t.getRules().stream().map(RuleResponse::new).collect(Collectors.toSet()),
                t.getCreatedAt()
        );
    }
}
