package com.qualyra.backend.domain.user.dto;

import com.qualyra.backend.domain.user.Role;
import jakarta.validation.constraints.*;

public record CreateUserRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8) String password,
        @NotNull Role role
) {}
