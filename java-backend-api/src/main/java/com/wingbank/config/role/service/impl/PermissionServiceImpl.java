package com.wingbank.config.role.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.BadRequestException;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.role.dto.PermissionRequest;
import com.wingbank.config.role.dto.PermissionResponse;
import com.wingbank.config.role.entity.Permission;
import com.wingbank.config.role.repository.PermissionRepository;
import com.wingbank.config.role.service.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PermissionResponse> getAllPermissions(String search, String module, int page, int size) {
        Page<Permission> permissionPage = permissionRepository.findAllWithFilters(search, module, PageRequest.of(page, size));
        var content = permissionPage.getContent().stream().map(this::toResponse).collect(Collectors.toList());
        return PagedResponse.from(permissionPage, content);
    }

    @Override
    @Transactional(readOnly = true)
    public PermissionResponse getPermissionById(UUID id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission", "id", id));
        return toResponse(permission);
    }

    @Override
    @Transactional
    public PermissionResponse createPermission(PermissionRequest request) {
        if (permissionRepository.existsByName(request.getName())) {
            throw new BadRequestException("Permission name already exists: " + request.getName());
        }

        Permission permission = new Permission();
        permission.setName(request.getName());
        permission.setModule(request.getModule());
        permission.setDescription(request.getDescription());

        Permission saved = permissionRepository.save(permission);
        log.info("Permission created: {}", saved.getName());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public PermissionResponse updatePermission(UUID id, PermissionRequest request) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission", "id", id));

        if (!permission.getName().equals(request.getName()) && permissionRepository.existsByName(request.getName())) {
            throw new BadRequestException("Permission name already exists: " + request.getName());
        }

        permission.setName(request.getName());
        permission.setModule(request.getModule());
        permission.setDescription(request.getDescription());

        Permission saved = permissionRepository.save(permission);
        log.info("Permission updated: {}", saved.getName());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deletePermission(UUID id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission", "id", id));
        permission.setDeleted(true);
        permissionRepository.save(permission);
        log.info("Permission soft deleted: {}", permission.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getModules() {
        return permissionRepository.findDistinctModules();
    }

    private PermissionResponse toResponse(Permission permission) {
        return PermissionResponse.builder()
                .id(permission.getId())
                .name(permission.getName())
                .module(permission.getModule())
                .description(permission.getDescription())
                .createdAt(permission.getCreatedAt())
                .build();
    }
}
