package com.qualyra.backend.domain.topic.dto;

import jakarta.validation.constraints.NotBlank;

public record TopicRequest(
        @NotBlank String name,
        String description
) {}
