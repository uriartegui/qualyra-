package com.qualyra.backend.domain.regression.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateRegressionRequest(
        @NotBlank String name,
        @NotNull UUID templateId
) {}
