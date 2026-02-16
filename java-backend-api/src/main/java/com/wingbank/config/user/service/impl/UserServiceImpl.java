package com.wingbank.config.user.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.BadRequestException;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.role.entity.Role;
import com.wingbank.config.role.repository.RoleRepository;
import com.wingbank.config.user.dto.UserRequest;
import com.wingbank.config.user.dto.UserResponse;
import com.wingbank.config.user.entity.User;
import com.wingbank.config.user.repository.UserRepository;
import com.wingbank.config.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getAllUsers(String search, String status, int page, int size) {
        User.Status statusEnum = status != null ? User.Status.valueOf(status) : null;
        Page<User> userPage = userRepository.findAllWithFilters(search, statusEnum, PageRequest.of(page, size));
        var content = userPage.getContent().stream().map(this::toResponse).collect(Collectors.toList());
        return PagedResponse.from(userPage, content);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists: " + request.getEmail());
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setStatus(request.getStatus() != null ? User.Status.valueOf(request.getStatus()) : User.Status.ACTIVE);

        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            Set<Role> roles = roleRepository.findByIdIn(request.getRoleIds());
            user.setRoles(roles);
        }

        User saved = userRepository.save(user);
        log.info("User created: {}", saved.getEmail());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse updateUser(UUID id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists: " + request.getEmail());
        }

        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getStatus() != null) {
            user.setStatus(User.Status.valueOf(request.getStatus()));
        }
        if (request.getRoleIds() != null) {
            Set<Role> roles = roleRepository.findByIdIn(request.getRoleIds());
            user.setRoles(roles);
        }

        User saved = userRepository.save(user);
        log.info("User updated: {}", saved.getEmail());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setDeleted(true);
        userRepository.save(user);
        log.info("User soft deleted: {}", user.getEmail());
    }

    @Override
    @Transactional
    public UserResponse assignRoles(UUID userId, Set<UUID> roleIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Set<Role> roles = roleRepository.findByIdIn(roleIds);
        user.setRoles(new HashSet<>(roles));
        User saved = userRepository.save(user);
        log.info("Roles assigned to user: {}", saved.getEmail());
        return toResponse(saved);
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .status(user.getStatus().name())
                .roles(user.getRoles().stream()
                        .map(r -> UserResponse.RoleInfo.builder()
                                .id(r.getId())
                                .name(r.getName())
                                .description(r.getDescription())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
