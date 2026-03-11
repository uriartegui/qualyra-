package com.qualyra.backend.domain.organization.dto;

import com.qualyra.backend.domain.organization.OrganizationType;
import jakarta.validation.constraints.*;

public record UpdateOrganizationRequest(@NotBlank String name, @NotNull OrganizationType type) {}
