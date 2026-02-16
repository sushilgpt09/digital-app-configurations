package com.wingbank.config.role.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.BadRequestException;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.role.dto.RoleRequest;
import com.wingbank.config.role.dto.RoleResponse;
import com.wingbank.config.role.entity.Permission;
import com.wingbank.config.role.entity.Role;
import com.wingbank.config.role.repository.PermissionRepository;
import com.wingbank.config.role.repository.RoleRepository;
import com.wingbank.config.role.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<RoleResponse> getAllRoles(String search, String status, int page, int size) {
        Role.Status statusEnum = status != null ? Role.Status.valueOf(status) : null;
        Page<Role> rolePage = roleRepository.findAllWithFilters(search, statusEnum, PageRequest.of(page, size));
        var content = rolePage.getContent().stream().map(this::toResponse).collect(Collectors.toList());
        return PagedResponse.from(rolePage, content);
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getRoleById(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));
        return toResponse(role);
    }

    @Override
    @Transactional
    public RoleResponse createRole(RoleRequest request) {
        if (roleRepository.existsByName(request.getName())) {
            throw new BadRequestException("Role name already exists: " + request.getName());
        }

        Role role = new Role();
        role.setName(request.getName());
        role.setDescription(request.getDescription());
        role.setStatus(request.getStatus() != null ? Role.Status.valueOf(request.getStatus()) : Role.Status.ACTIVE);

        if (request.getPermissionIds() != null && !request.getPermissionIds().isEmpty()) {
            Set<Permission> permissions = permissionRepository.findByIdIn(request.getPermissionIds());
            role.setPermissions(permissions);
        }

        Role saved = roleRepository.save(role);
        log.info("Role created: {}", saved.getName());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public RoleResponse updateRole(UUID id, RoleRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));

        if (!role.getName().equals(request.getName()) && roleRepository.existsByName(request.getName())) {
            throw new BadRequestException("Role name already exists: " + request.getName());
        }

        role.setName(request.getName());
        role.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            role.setStatus(Role.Status.valueOf(request.getStatus()));
        }
        if (request.getPermissionIds() != null) {
            Set<Permission> permissions = permissionRepository.findByIdIn(request.getPermissionIds());
            role.setPermissions(new HashSet<>(permissions));
        }

        Role saved = roleRepository.save(role);
        log.info("Role updated: {}", saved.getName());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteRole(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));
        role.setDeleted(true);
        roleRepository.save(role);
        log.info("Role soft deleted: {}", role.getName());
    }

    private RoleResponse toResponse(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .status(role.getStatus().name())
                .permissions(role.getPermissions().stream()
                        .map(p -> RoleResponse.PermissionInfo.builder()
                                .id(p.getId())
                                .name(p.getName())
                                .module(p.getModule())
                                .description(p.getDescription())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(role.getCreatedAt())
                .updatedAt(role.getUpdatedAt())
                .build();
    }
}
