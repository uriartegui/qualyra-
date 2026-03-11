package com.qualyra.backend.auth;

import com.qualyra.backend.auth.dto.*;
import com.qualyra.backend.domain.organization.Organization;
import com.qualyra.backend.domain.organization.OrganizationRepository;
import com.qualyra.backend.domain.user.*;
import com.qualyra.backend.domain.user.dto.UserResponse;
import com.qualyra.backend.infrastructure.exception.BusinessException;
import com.qualyra.backend.infrastructure.jwt.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final long refreshTokenExpiration;

    public AuthService(UserRepository userRepository,
                       OrganizationRepository organizationRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder,
                       @Value("${jwt.refresh-token-expiration}") long refreshTokenExpiration) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    @Transactional
    public LoginResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new BusinessException("Email já está em uso");
        }

        Organization org = organizationRepository.save(new Organization(req.orgName(), req.orgType()));
        User owner = new User(org, req.userName(), req.email(),
                passwordEncoder.encode(req.password()), Role.OWNER);
        owner = userRepository.save(owner);

        return buildResponse(owner);
    }

    @Transactional
    public LoginResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }
        if (!user.isActive()) {
            throw new IllegalArgumentException("Usuário desativado");
        }

        refreshTokenRepository.revokeAllByUserId(user.getId());
        return buildResponse(user);
    }

    @Transactional
    public LoginResponse refresh(RefreshTokenRequest req) {
        RefreshToken rt = refreshTokenRepository.findByToken(req.refreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Refresh token inválido"));

        if (rt.isRevoked() || rt.isExpired()) {
            throw new IllegalArgumentException("Refresh token expirado ou revogado");
        }

        rt.setRevoked(true);
        refreshTokenRepository.save(rt);
        return buildResponse(rt.getUser());
    }

    @Transactional
    public void logout(RefreshTokenRequest req) {
        refreshTokenRepository.findByToken(req.refreshToken()).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    private LoginResponse buildResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String rawRefresh = UUID.randomUUID().toString();

        refreshTokenRepository.save(new RefreshToken(
                user, rawRefresh, Instant.now().plusMillis(refreshTokenExpiration)));

        return new LoginResponse(accessToken, rawRefresh, new UserResponse(user));
    }
}
