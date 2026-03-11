package com.qualyra.backend.domain.template.dto;

import com.qualyra.backend.domain.template.Template;

import java.time.Instant;
import java.util.UUID;

// Versão resumida para listagem (sem as regras)
public record TemplateSummaryResponse(
        UUID id,
        String name,
        String description,
        boolean active,
        UUID createdById,
        String createdByName,
        int totalRules,
        Instant createdAt
) {
    public TemplateSummaryResponse(Template t) {
        this(
                t.getId(),
                t.getName(),
                t.getDescription(),
                t.isActive(),
                t.getCreatedBy().getId(),
                t.getCreatedBy().getName(),
                t.getRules().size(),
                t.getCreatedAt()
        );
    }
}
