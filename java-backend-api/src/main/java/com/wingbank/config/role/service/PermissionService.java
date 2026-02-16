package com.wingbank.config.role.service;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.role.dto.PermissionRequest;
import com.wingbank.config.role.dto.PermissionResponse;

import java.util.List;
import java.util.UUID;

public interface PermissionService {

    PagedResponse<PermissionResponse> getAllPermissions(String search, String module, int page, int size);

    PermissionResponse getPermissionById(UUID id);

    PermissionResponse createPermission(PermissionRequest request);

    PermissionResponse updatePermission(UUID id, PermissionRequest request);

    void deletePermission(UUID id);

    List<String> getModules();
}
