package com.wingbank.config.role.service;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.role.dto.RoleRequest;
import com.wingbank.config.role.dto.RoleResponse;

import java.util.UUID;

public interface RoleService {

    PagedResponse<RoleResponse> getAllRoles(String search, String status, int page, int size);

    RoleResponse getRoleById(UUID id);

    RoleResponse createRole(RoleRequest request);

    RoleResponse updateRole(UUID id, RoleRequest request);

    void deleteRole(UUID id);
}
