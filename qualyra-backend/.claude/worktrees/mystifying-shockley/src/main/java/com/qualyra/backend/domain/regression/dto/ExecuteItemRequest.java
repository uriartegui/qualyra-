package com.qualyra.backend.domain.regression.dto;

import com.qualyra.backend.domain.regression.RegressionResultValue;
import jakarta.validation.constraints.NotNull;

public record ExecuteItemRequest(
        @NotNull RegressionResultValue result,
        String notes
) {}
