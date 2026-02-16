package com.wingbank.config.role.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class RoleRequest {

    @NotBlank(message = "Role name is required")
    private String name;

    private String description;

    private String status;

    private Set<UUID> permissionIds;
}
