package com.qualyra.backend.domain.user.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateUserRequest(@NotBlank String name) {}
