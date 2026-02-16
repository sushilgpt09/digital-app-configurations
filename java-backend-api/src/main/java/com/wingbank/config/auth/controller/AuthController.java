package com.wingbank.config.auth.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.exception.UnauthorizedException;
import com.wingbank.config.security.dto.LoginRequest;
import com.wingbank.config.security.dto.LoginResponse;
import com.wingbank.config.security.dto.RefreshTokenRequest;
import com.wingbank.config.security.jwt.JwtTokenProvider;
import com.wingbank.config.user.entity.User;
import com.wingbank.config.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 30;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and generate tokens")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (user.isAccountLocked()) {
            throw new UnauthorizedException("Account is locked. Please try again after " + user.getLockedUntil());
        }

        if (user.getStatus() == User.Status.INACTIVE) {
            throw new UnauthorizedException("Account is inactive. Please contact administrator");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            user.setFailedLoginAttempts(0);
            user.setLockedUntil(null);
            user.setStatus(User.Status.ACTIVE);

            String accessToken = jwtTokenProvider.generateAccessToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(request.getEmail());

            user.setRefreshToken(refreshToken);
            userRepository.save(user);

            LoginResponse loginResponse = buildLoginResponse(user, accessToken, refreshToken);
            log.info("User logged in successfully: {}", request.getEmail());
            return ResponseEntity.ok(ApiResponse.success("Login successful", loginResponse));

        } catch (BadCredentialsException e) {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);

            if (attempts >= MAX_FAILED_ATTEMPTS) {
                user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
                user.setStatus(User.Status.LOCKED);
                userRepository.save(user);
                log.warn("Account locked due to {} failed login attempts: {}", attempts, request.getEmail());
                throw new UnauthorizedException("Account has been locked for " + LOCK_DURATION_MINUTES + " minutes due to too many failed login attempts");
            }

            userRepository.save(user);
            log.warn("Failed login attempt {} for user: {}", attempts, request.getEmail());
            throw new UnauthorizedException("Invalid email or password. " + (MAX_FAILED_ATTEMPTS - attempts) + " attempts remaining");
        }
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using refresh token")
    public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (user.getRefreshToken() == null || !user.getRefreshToken().equals(refreshToken)) {
            throw new UnauthorizedException("Refresh token does not match. Please login again");
        }

        String newAccessToken = jwtTokenProvider.generateAccessToken(email);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(email);

        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        LoginResponse loginResponse = buildLoginResponse(user, newAccessToken, newRefreshToken);
        log.info("Tokens refreshed for user: {}", email);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", loginResponse));
    }

    private LoginResponse buildLoginResponse(User user, String accessToken, String refreshToken) {
        var permissions = user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(permission -> permission.getName())
                .collect(Collectors.toSet());

        var roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpiration())
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .roles(roles)
                        .permissions(permissions)
                        .build())
                .build();
    }
}
