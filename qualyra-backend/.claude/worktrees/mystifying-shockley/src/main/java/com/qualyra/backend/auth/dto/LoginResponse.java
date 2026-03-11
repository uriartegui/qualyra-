package com.qualyra.backend.auth.dto;

import com.qualyra.backend.domain.user.dto.UserResponse;

public record LoginResponse(String accessToken, String refreshToken, UserResponse user) {}
