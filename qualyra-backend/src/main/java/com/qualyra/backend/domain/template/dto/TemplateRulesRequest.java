package com.qualyra.backend.domain.template.dto;

import jakarta.validation.constraints.NotNull;
import java.util.Set;
import java.util.UUID;

public record TemplateRulesRequest(@NotNull Set<UUID> ruleIds) {}
