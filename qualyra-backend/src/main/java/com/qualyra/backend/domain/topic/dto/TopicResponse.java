package com.qualyra.backend.domain.topic.dto;

import com.qualyra.backend.domain.topic.Topic;

import java.time.Instant;
import java.util.UUID;

public record TopicResponse(
        UUID id,
        String name,
        String description,
        UUID createdById,
        String createdByName,
        boolean active,
        Instant createdAt
) {
    public TopicResponse(Topic t) {
        this(t.getId(), t.getName(), t.getDescription(),
                t.getCreatedBy().getId(), t.getCreatedBy().getName(),
                t.isActive(), t.getCreatedAt());
    }
}
