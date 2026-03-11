package com.qualyra.backend.domain.rule.dto;

import jakarta.validation.constraints.NotBlank;

public record RuleRequest(
        @NotBlank String title,
        String description,
        String steps,
        String expectedResult,
        String observations
) {}

