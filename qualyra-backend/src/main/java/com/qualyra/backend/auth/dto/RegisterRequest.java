package com.qualyra.backend.auth.dto;

import com.qualyra.backend.domain.organization.OrganizationType;
import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank String orgName,
        @NotNull OrganizationType orgType,
        @NotBlank String userName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8) String password
) {}
