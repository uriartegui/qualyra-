package com.qualyra.backend.domain.template.dto;

import jakarta.validation.constraints.NotBlank;

public record TemplateRequest(
        @NotBlank String name,
        String description
) {}
